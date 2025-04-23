// In your auth middleware when user logs in
const trackSession = async (user, req) => {
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;
    
    // You might want to use a service like ipapi to get location
    const location = await getLocationFromIP(ip); 
    
    const newSession = {
      _id: new mongoose.Types.ObjectId(),
      deviceType: getDeviceType(userAgent),
      deviceName: getDeviceName(userAgent),
      browser: getBrowser(userAgent),
      os: getOS(userAgent),
      ipAddress: ip,
      location,
      userAgent,
      lastActive: new Date()
    };
    
    user.sessions.push(newSession);
    user.currentSessionId = newSession._id;
    await user.save();
    
    return newSession._id;
  };
  module.exports=trackSession;
