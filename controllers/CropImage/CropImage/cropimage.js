const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../../../Models/CropImage");
const productValidator = require("../../../Validators/Product/productvalidator");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const User = require("../../../Models/usermode");
const MainCategory = require("../../../Models/MainCategory");
const Category = require("../../../Models/Category");
const SubCategory = require("../../../Models/SubCategory");

const addProduct = async (req, res) => {
  try {
    const { error, value } = productValidator.validate(req.body);

    if (error) {
      if (req.files && req.files["images"]) {
        req.files["images"].forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const productData = {
      ...value,
      userId: value.userId,
      mainCategory: value.mainCategory,
      category: value.category,
      subCategory: value.subCategory,
      productType: value.productType,
      editionNumber:
        value.productType === "limited" ? value.editionNumber : undefined,
      iframeLink: req.body.iframeLink || undefined,

      shippingCharges: value.shippingCharges,
      estimatedDelivery: value.estimatedDelivery,
      packagingType: value.packagingType,
      insuranceCoverage: value.insuranceCoverage || false,
      selfShipping: value.selfShipping || false,
      quantity: value.quantity,
      hsnCode: value.hsnCode || undefined,
      surfaceType: value.surfaceType || undefined,
      isSigned: value.isSigned,
      condition: value.condition,
      provenance: value.provenance || undefined,

      autoCancelOrder: value.autoCancelOrder || false,
      giftWrapping: value.giftWrapping || false,
      giftWrappingCustomMessage: value.giftWrappingCustomMessage || "",
      giftWrappingCost: value.giftWrappingCost || false,
      giftWrappingCostAmount: value.giftWrappingCost
        ? value.giftWrappingCostAmount
        : 0,

      // NFT Details
      blockchainNetwork: value.blockchainNetwork || undefined,
      smartContractAddress: value.smartContractAddress || undefined,
      tokenStandard: value.tokenStandard || undefined,
      tokenId: value.tokenId || undefined,
      walletAddress: value.walletAddress || undefined,
      royaltyPercentage: value.royaltyPercentage || undefined,
      mintingType: value.mintingType || undefined,
      licenseType: value.licenseType || undefined,
      ipfsStorage: value.ipfsStorage || false,
      unlockableContent: value.unlockableContent || false,
      partOfCollection: value.partOfCollection || false,
      collectionName: value.partOfCollection ? value.collectionName : undefined,
      editionSize: value.partOfCollection
        ? parseInt(value.editionSize)
        : undefined,
      rarityType: value.rarityType || undefined,
      traits: value.traits || undefined,

      originRegion: value.originRegion || undefined,
      periodEra: value.periodEra || undefined,
      antiqueCondition: value.antiqueCondition || undefined,
      restorationHistory: value.restorationHistory || undefined,
      provenanceHistory: value.provenanceHistory || undefined,
      engravingMarkings: value.engravingMarkings || undefined,
      patinaWear: value.patinaWear || undefined,
      isHandmade: value.isHandmade || false,
      originalReproduction: value.originalReproduction || undefined,
      museumExhibitionHistory: value.museumExhibitionHistory || undefined,
      customEngravingAvailable: value.customEngravingAvailable || false,

      //Address Field

      addressLine1: value.addressLine1 || undefined,
      addressLine2: value.addressLine2 || undefined,
      landmark: value.landmark || undefined,
      city: value.city || undefined,
      state: value.state || undefined,
      country: value.country || undefined,
      pincode: value.pincode || undefined,
      // Legal & Compliance fields
      ownershipConfirmation: value.ownershipConfirmation,
      copyrightRights: value.copyrightRights,
      prohibitedItems: value.prohibitedItems,
      artistSignature: value.artistSignature,
      signatureType: value.signatureType || undefined,
      coaAvailable: value.coaAvailable,
      certificateFormat: value.certificateFormat || "digital",

      certificateFile: req.files["certificateFile"]
        ? `/uploads/certificates/${req.files["certificateFile"][0].filename}`
        : undefined,
      coaFile: req.files["coaFile"]
        ? `/uploads/coa/${req.files["coaFile"][0].filename}`
        : undefined,
    };

    if (value.coaAvailable) {
      productData.certificateType = value.certificateType;
      productData.issuerName = value.issuerName;
      productData.verificationNumber = value.verificationNumber;
    }

    if (req.files && req.files["images"] && req.files["images"].length > 0) {
      productData.mainImage = `/uploads/productImage/${req.files["images"][0].filename}`;

      if (req.files["images"].length > 1) {
        productData.otherImages = req.files["images"]
          .slice(1)
          .map((file) => `/uploads/productImage/${file.filename}`);
      }
    }

    if (!productData.finalPrice && productData.sellingPrice) {
      const discount = productData.discount || 0;
      productData.finalPrice = productData.sellingPrice * (1 - discount / 100);
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    console.log("New product created:", savedProduct);

    await sendProductCreationEmails(savedProduct, req.files);

    res.status(201).json({
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    if (req.files) {
      Object.values(req.files).forEach((files) => {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate key error",
        details: ["This token ID already exists for the given smart contract"],
      });
    }
    res.status(500).json({
      message: "Error while adding product",
      error: error.message,
    });
  }
};

const sendProductCreationEmails = async (product, files) => {
  try {
    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) {
      console.log("No email settings found in database");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.mailHost,
      port: emailSettings.mailPort,
      secure: emailSettings.mailEncryption === "SSL",
      auth: {
        user: emailSettings.mailUsername,
        pass: emailSettings.mailPassword,
      },
    });

    const logoPath = path.join(
      __dirname,
      "../../../controllers/Email/Artsays.png"
    );
    let attachments = [];

    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: "artsays-logo.png",
        path: logoPath,
        cid: "artsays_logo",
      });
    }

    // Only include the main image (first image)
    if (files && files["images"] && files["images"].length > 0) {
      attachments.push({
        filename: `product-main-image.${files["images"][0].filename.split('.').pop()}`,
        path: files["images"][0].path,
        cid: `product_main_image`,
      });
    }

    const user = await User.findById(product.userId);
    if (!user) {
      console.log("User not found for product creator");
      return;
    }

    const superAdmins = await User.find({ role: "super-admin" });
    if (superAdmins.length === 0) {
      console.log("No super-admin found to notify");
    }

    const [mainCategory, category, subCategory] = await Promise.all([
      MainCategory.findById(product.mainCategory),
      Category.findById(product.category),
      product.subCategory ? SubCategory.findById(product.subCategory) : null,
    ]);

    const categoryDetails = {
      mainCategory: mainCategory?.mainCategoryName || "N/A",
      category: category?.categoryName || "N/A",
      subCategory: subCategory?.subCategoryName || "",
    };

    await sendProductCreatorEmail(
      transporter,
      emailSettings,
      user,
      product,
      attachments,
      categoryDetails
    );

    if (superAdmins.length > 0) {
      await sendAdminNotificationEmail(
        transporter,
        emailSettings,
        superAdmins,
        user,
        product,
        attachments,
        categoryDetails
      );
    }
  } catch (error) {
    console.error("Error sending product creation emails:", error);
  }
};

const sendProductCreatorEmail = async (
  transporter,
  emailSettings,
  user,
  product,
  attachments,
  categoryDetails
) => {
  try {
    const statusBadgeStyle =
      product.status === "Approved"
        ? "background-color: #48bb78; color: white;"
        : product.status === "Pending"
        ? "background-color: #ed8936; color: white;"
        : "background-color: #f56565; color: white;";

    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to: user.email,
      subject: `Your Product "${product.productName}" Has Been Created`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .outer-container { padding: 0px 0 !important; }
      .email-container { border-radius: 0 !important; }
      .content { padding: 20px !important; }
      .product-info-item { flex-direction: column !important; }
      .product-info-label { margin-bottom: 5px !important; }
    }
    
    .image-container {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .product-image {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f2f2f2;">
  <div class="outer-container" style="padding: 80px 0; background-color: #f2f2f2; width: 100%;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div class="header" style="background: linear-gradient(135deg, rgb(204, 151, 121) 0%, rgb(204, 151, 121) 100%); padding: 30px 20px; text-align: center; color: white;">
        <div class="logo-container" style="margin-bottom: 20px;">
          ${
            attachments.length > 0
              ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">`
              : ""
          }
        </div>
        <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: black;">Product Created Successfully</h1>
      </div>

      <!-- Content -->
      <div class="content" style="padding: 30px;">
        <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear ${
          user.name
        },</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">Thank you for creating a new product on Artsays. Your product has been successfully submitted!</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">Here are the details of your product:</p>
        
        <!-- Product Info Box -->
        <div style="background: rgb(244, 236, 233); border-left: 4px solid rgb(173, 100, 73); padding: 20px; margin: 25px 0; border-radius: 4px;">
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Product Title:</span>
            <span style="color: #4a5568;">${product.productName}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Status:</span>
            <span style="color: #4a5568;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 14px; ${statusBadgeStyle}">
                ${product.status || "Pending"}
              </span>
            </span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Price:</span>
            <span style="color: #4a5568;">₹${
              product.finalPrice || product.sellingPrice
            }</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Quantity:</span>
            <span style="color: #4a5568;">${product.quantity}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Main Category:</span>
            <span style="color: #4a5568;"> ${categoryDetails.mainCategory}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Created On:</span>
            <span style="color: #4a5568;">
              ${new Date(product.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          ${
            product.productType === "limited"
              ? `
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Edition:</span>
            <span style="color: #4a5568;">${product.editionNumber}</span>
          </div>
          `
              : ""
          }
        </div>
        
        <!-- Main Product Image -->
        ${
          attachments.find(att => att.cid === "product_main_image")
            ? `
        <div style="margin: 30px 0;">
          <p style="font-weight: 600; margin-bottom: 15px; color: #2d3748; font-size: 16px;">Product Main Image:</p>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); max-width: 300px; margin: 0 auto;">
            <img src="cid:product_main_image" alt="Product Main Image" style="width: 100%; height: auto; display: block;">
          </div>
        </div>
        `
            : ""
        }
        
        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
          ${
            product.status === "Approved"
              ? "Your product has been approved and is now live on our platform!"
              : product.status === "Pending"
              ? "Your product is under review by our team. You will be notified once it is approved."
              : "Your product has been rejected. Please check the guidelines and submit again."
          }
        </p>
        
        <!-- Action Button -->
        <div style="text-align: center;">
          <a href="http://localhost:3000/login" style="display: inline-block; background: rgb(173, 100, 73); color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">
            View Your Products
          </a>
        </div>
        
        <!-- Support Section -->
        <div style="margin-top: 20px; font-size: 15px;">
          <p>If you have any questions about your product submission, please contact our support team.</p>
        </div>
        
        <!-- Signature -->
        <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
          <p>Best regards,</p>
          <p><strong>The Artsays Team</strong></p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; background:rgb(244, 236, 233); font-size: 14px; color: #718096;">
        <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Product creation email sent to user ${user.email}`);
  } catch (error) {
    console.error("Error sending product creator email:", error);
  }
};

const sendAdminNotificationEmail = async (transporter, emailSettings, admins, user, product, attachments, categoryDetails) => {
  try {
    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to: admins.map(admin => admin.email).join(','),
      subject: `New Product Created: ${product.productName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .outer-container { padding: 0px 0 !important; }
      .email-container { border-radius: 0 !important; }
      .content { padding: 20px !important; }
      .product-info-item { flex-direction: column !important; }
      .product-info-label { margin-bottom: 5px !important; }
    }
    
    .image-container {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .product-image {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f2f2f2;">
  <div class="outer-container" style="padding: 80px 0; background-color: #f2f2f2; width: 100%;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div class="header" style="background: linear-gradient(135deg, rgb(204, 151, 121) 0%, rgb(204, 151, 121) 100%); padding: 30px 20px; text-align: center; color: white;">
        <div class="logo-container" style="margin-bottom: 20px;">
          ${attachments.length > 0 ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ""}
        </div>
        <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: black;">New Product Created</h1>
      </div>

      <!-- Content -->
      <div class="content" style="padding: 30px;">
        <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear Admin,</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">A new product has been created on Artsays by ${user.name} ${user.lastName} (${user.email}).</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">Here are the product details:</p>
        
        <!-- Product Info Box -->
        <div style="background: rgb(244, 236, 233); border-left: 4px solid rgb(173, 100, 73); padding: 20px; margin: 25px 0; border-radius: 4px;">
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Product Title:</span>
            <span style="color: #4a5568;">${product.productName}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Creator:</span>
            <span style="color: #4a5568;">${user.name} ${user.lastName} (${user.email})</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Status:</span>
            <span style="color: #4a5568;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 14px; background-color: #ed8936; color: white;">
                ${product.status || 'Pending Review'}
              </span>
            </span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Price:</span>
            <span style="color: #4a5568;">₹${product.finalPrice || product.sellingPrice}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Quantity:</span>
            <span style="color: #4a5568;">${product.quantity}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Main Category:</span>
            <span style="color: #4a5568;"> ${categoryDetails.mainCategory}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Created On:</span>
            <span style="color: #4a5568;">
              ${new Date(product.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        
        <!-- Main Product Image -->
        ${attachments.find(att => att.cid === "product_main_image")
          ? `
        <div style="margin: 30px 0;">
          <p style="font-weight: 600; margin-bottom: 15px; color: #2d3748; font-size: 16px;">Product Main Image:</p>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); max-width: 300px; margin: 0 auto;">
            <img src="cid:product_main_image" alt="Product Main Image" style="width: 100%; height: auto; display: block;">
          </div>
        </div>
        `
          : ''}
        
        <!-- Status Notice -->
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-weight: bold;">Action Required</p>
          <p style="margin: 10px 0 0 0; color: #856404;">
            This new product is currently <strong>Pending Review</strong>. 
            Please review the product details and approve or reject it as appropriate.
          </p>
        </div>
        
        <!-- Action Button -->
        <div style="text-align: center;">
          <a href="http://localhost:3000/login" style="display: inline-block; background: rgb(173, 100, 73); color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">
            Review Product
          </a>
        </div>
        
        <!-- Signature -->
        <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
          <p>Best regards,</p>
          <p><strong>The Artsays Team</strong></p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; background:rgb(244, 236, 233); font-size: 14px; color: #718096;">
        <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`Product notification email sent to admins`);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
};

module.exports = addProduct;