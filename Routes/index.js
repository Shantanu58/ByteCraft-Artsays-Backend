const userRoute = require('../Routes/User.js');
const refreshTokenRoute = require('../Routes/refreshtokens');
const addressRoute = require('../Routes/useradress');
const transactionRoute = require('../Routes/transactionRoutes');
const orderRoute = require('../Routes/orderRoutes');
const shippingRoute = require('../Routes/shippingRoutes');
const socialBlogRoute = require('../Routes/socialBlogRoutes');
const requestedArtsRoutes = require('../Routes/requestedArtsRoutes');
const artistRoutes = require('../Routes/artistRoutes.js');
const productRoute = require('../Routes/ProductRout.js');
const buyerRoutes = require('../Routes/buyerRoutes');
const cartRoutes = require('../Routes/cartRoutes.js');
const wishlistRoutes = require('../Routes/wishlist.js');
const blogPostRoutes = require('../Routes/BlogpostRoutes.js');
const conversationRoutes = require('../Routes/conversationRoutes.js');
const messageRoutes = require('../Routes/messageRoutes.js');
const getuserRoutes = require('../Routes/getandupdateuserRoutes.js');
const BuyerCustomRequestRoutes =require('../Routes/BuyerCustomRequestRoutes.js')
const CropImageRoutes=require('../Routes/CropImageRoutes.js');

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
  app.use('/product-management', productRoute);
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
  
};
