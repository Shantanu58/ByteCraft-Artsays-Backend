const userRoute = require('../Routes/User.js');
const refreshTokenRoute = require('../Routes/refreshtokens');
const addressRoute = require('../Routes/useradress');
const transactionRoute = require('../Routes/transactionRoutes');
const orderRoute = require('../Routes/orderRoutes');
const shippingRoute = require('../Routes/shippingRoutes');
const socialBlogRoute = require('../Routes/socialBlogRoutes');
const requestedArtsRoutes = require('../Routes/requestedArtsRoutes');
const artistRoutes = require('../Routes/artistRoutes.js');
// const productRoute = require('../Routes/ProductRout.js');
const buyerRoutes = require('../Routes/buyerRoutes');
const cartRoutes = require('../Routes/cartRoutes.js');
const wishlistRoutes = require('../Routes/wishlist.js');
const blogPostRoutes = require('../Routes/BlogpostRoutes.js');
const conversationRoutes = require('../Routes/conversationRoutes.js');
const messageRoutes = require('../Routes/messageRoutes.js');
const getuserRoutes = require('../Routes/getandupdateuserRoutes.js');
const BuyerCustomRequestRoutes =require('../Routes/BuyerCustomRequestRoutes.js')
const CropImageRoutes=require('../Routes/CropImageRoutes.js');
const SellerRoutes=require('../Routes/sellerRoutes.js');
const ArtistproductRoutes=require('../Routes/artistproductRoutes.js');
const BuyerproductRoutes=require('../Routes/buyerproductroutes.js');
const ResellproductRoutes=require('../Routes/resellproductRoutes.js');
const TransactionRoutes=require('../Routes/transaction.js');
const PackagingMaterialRoutes=require('../Routes/packagingmaterialRoutes.js');
const Biddingroutes=require('../Routes/biddingRoutes.js')
const Categoryroutes=require('../Routes/categoryRoutes.js')
const Adminroutes=require('../Routes/adminRoutes.js')
const ForgotPasswordRoutes=require('../Routes/forgotpasswordRoutes.js')
const EmailRoutes = require("../Routes/EmailSettingRoutes.js");
const TemplatesRoutes = require("../Routes/EmailTemplatesRoutes.js")
const MarketingEmailRoutes = require("../Routes/MarketingEmailRoutes");

module.exports = (app) => {
  app.use('/auth', userRoute);
  app.use('/refresh-token', refreshTokenRoute);
  app.use('/user-address', addressRoute);
  app.use('/transactions', transactionRoute);
  app.use('/orders', orderRoute);
  app.use('/shipping', shippingRoute);
  app.use('/social', socialBlogRoute);
  app.use('/api/requested-arts', requestedArtsRoutes);
  app.use('/artist', artistRoutes);
  // app.use('/product-management', productRoute);
  app.use('/uploads', require('express').static('uploads'));
  app.use('/api/buyers', buyerRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/Blog-Post', blogPostRoutes);
  app.use('/api/conversation', conversationRoutes);
  app.use('/api/message', messageRoutes);
  app.use('/auth', getuserRoutes);
  
  app.use('/api', BuyerCustomRequestRoutes );
  app.use('/api', CropImageRoutes);
  app.use('/api', SellerRoutes);
  app.use('/api', ArtistproductRoutes);
  app.use('/api',BuyerproductRoutes);
  app.use('/api',ResellproductRoutes);
  app.use('/api',TransactionRoutes);
  app.use('/api',PackagingMaterialRoutes);
  app.use('/api',Biddingroutes);
  app.use('/api',Categoryroutes);
  app.use('/api',Adminroutes);
  app.use('/api',ForgotPasswordRoutes);
  app.use("/api", EmailRoutes)
  app.use("/api", TemplatesRoutes)
  app.use("/api", MarketingEmailRoutes);
 
  
};
