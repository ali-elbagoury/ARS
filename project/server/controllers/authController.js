const { getDB } = require("../connect");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific directory if it doesn't exist
    const userDir = path.join("uploads", req.body.regNumber);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Keep original field name in the filename for reference
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Configure multer to handle multiple files
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
}).fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
  { name: "photo5", maxCount: 1 },
  { name: "recording1", maxCount: 1 },
  { name: "recording2", maxCount: 1 },
  { name: "recording3", maxCount: 1 },
]);

const registerUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const { name, password, regNumber } = req.body;

    // Basic validation
    if (!name || !password || !regNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await usersCollection.findOne({ regNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Registration number already exists" });
    }

    // Prepare media paths
    const mediaPaths = {};

    // Process photos
    for (let i = 1; i <= 5; i++) {
      const fieldName = `photo${i}`;
      if (req.files[fieldName]) {
        mediaPaths[fieldName] = req.files[fieldName][0].path;
      } else {
        return res.status(400).json({ error: `Missing ${fieldName}` });
      }
    }

    // Process voice recordings (optional)
    const voicePaths = {};
    for (let i = 1; i <= 3; i++) {
      const fieldName = `recording${i}`;
      if (req.files[fieldName]) {
        voicePaths[fieldName] = req.files[fieldName][0].path;
      }
    }

    // Create new user document
    const newUser = {
      name,
      password, // Note: In production, hash this password before storing!
      regNumber,
      photos: mediaPaths,
      voiceRecordings: voicePaths,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Registration successful",
      userId: newUser._id,
      regNumber: newUser.regNumber,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Clean up uploaded files if error occurred
    if (req.files) {
      Object.values(req.files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }

    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
};

module.exports = { registerUser, upload };
