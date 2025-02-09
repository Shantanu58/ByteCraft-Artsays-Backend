const Image = require('../../../Models/CropImage');  

const addImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }


    console.log('Uploaded file:', req.file);

 
    const imagePath = req.file.path; 

 
    const newImage = new Image({
      image: imagePath,  
    });

    const savedImage = await newImage.save();

    res.status(201).json({
      message: 'Image added successfully',
      data: savedImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while adding image',
      error: error.message,
    });
  }
};

module.exports = addImage;
