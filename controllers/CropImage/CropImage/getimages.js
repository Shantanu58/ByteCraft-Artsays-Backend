// const Image = require('../../../Models/CropImage');

// const getImages = async (req, res) => {
//   try {
//     const images = await Image.find();  

//     if (!images.length) {
//       return res.status(404).json({ message: 'No images found' });
//     }

//     res.status(200).json({
//       message: 'Images retrieved successfully',
//       data: images,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Error while retrieving images',
//       error: error.message,
//     });
//   }
// };

// module.exports = getImages;
const Image = require('../../../Models/CropImage'); // Assuming your model is named Image

const getImages = async (req, res) => {
  try {
    const lastReloadTimestamp = req.body.lastReload || new Date();
    console.log("Last reload timestamp:", lastReloadTimestamp);

    // Fetch images created after the last reload timestamp
    let images = await Image.find({ createdAt: { $gte: lastReloadTimestamp } })
                            .sort({ createdAt: -1 });

    console.log("Fetched images:", images);

    if (images.length === 0) {
      return res.status(404).json({ message: 'No new images found' });
    }

    images = images.slice(0, 10); // Limit to max 10 images

    res.status(200).json({
      message: 'New images retrieved successfully',
      data: images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while retrieving images',
      error: error.message,
    });
  }
};


module.exports = getImages;






