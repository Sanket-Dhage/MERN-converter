const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configure multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for converting images
app.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const format = req.body.format || 'png';
    const outputFileName = `output.${format}`;
    const outputPath = path.join(__dirname, 'public', outputFileName);

    try {
        await sharp(req.file.buffer)
            .toFormat(format)
            .toFile(outputPath);

        res.json({ url: `http://localhost:${PORT}/${outputFileName}` });
    } catch (error) {
        console.error('Error converting image:', error);
        res.status(500).send('Failed to convert image.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
