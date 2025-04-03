const express = require('express');
const multer  = require('multer');
const path = require('path');
const Jimp = require('jimp');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the public folder
app.use(express.static('public'));

// POST endpoint to process the uploaded image
app.post('/convert', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        const inputPath = req.file.path;
        const outputPath = 'uploads/converted-' + req.file.filename + '.png';

        // Load the uploaded image with Jimp
        const image = await Jimp.read(inputPath);

        // Apply some illustrative effects to simulate a Ghibli style
        image.posterize(5)        // reduce the number of colors
             .contrast(0.2)        // slightly increase contrast
             .color([
                { apply: 'hue', params: [15] },
                { apply: 'saturate', params: [20] }
             ]);

        // Write the processed image to a new file
        image.write(outputPath, () => {
            // Optionally remove the original file
            fs.unlink(inputPath, err => { if (err) console.error(err); });
            // Send the converted image file as a response
            res.sendFile(path.resolve(outputPath), err => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error sending file.');
                }
                // You can choose to delete the converted file after sending
                // fs.unlink(outputPath, err => { if (err) console.error(err); });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image.');
    }
});

// Redirect /legal to the privacy page as an example
app.get('/legal', (req, res) => {
    res.redirect('/legal/privacy.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stelaron Ghibli Converter running on port ${PORT}`);
});

