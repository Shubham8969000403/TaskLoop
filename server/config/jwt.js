const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  console.log("🔥 generateToken called");

  const token = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );

  console.log("✅ Generated Token:", token);

  return token; 
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", decoded);
    return decoded;
  } catch (err) {
    console.log("❌ Token Error:", err.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };