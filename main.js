const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// === Configuration ===
const CONF_DIR = '/conf';
const API_KEY = fs.readFileSync(path.join(CONF_DIR, '.api'), 'utf-8').trim();
const CDN_FOLDER = fs.readFileSync(path.join(CONF_DIR, '.path'), 'utf-8').trim();
const BASE_URL = '/cdn/';

// Create folder if doesn't exist
if (!fs.existsSync(CDN_FOLDER)) {
  fs.mkdirSync(CDN_FOLDER, { recursive: true });
}

// === Middleware ===
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, CDN_FOLDER),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const auth = req.header('Authorization');
  if (auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// === Routes ===
app.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = BASE_URL + req.file.filename;
  res.json({ url: fileUrl });
});

// === Serve static files ===
app.use('/cdn', express.static(CDN_FOLDER));

// === Start server ===
app.listen(PORT, () => {
  console.log(`CDN server running at ${BASE_URL}`);
});