const { getDB } = require("../connect");
const multer = require("multer");

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).fields([
  { name: "photo", maxCount: 1 },
  { name: "voice", maxCount: 1 }
]);

const registerUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    
    const { name, email, password, regNumber } = req.body;
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { regNumber }]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      name,
      email,
      password, // Remember to hash this in production!
      regNumber,
      photoPath: req.files["photo"] ? req.files["photo"][0].path : null,
      voicePath: req.files["voice"] ? req.files["voice"][0].path : null,
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

module.exports = { registerUser, upload };