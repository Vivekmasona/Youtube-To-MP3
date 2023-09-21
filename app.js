const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use('/assets', express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/download/:videoID', async (req, res) => {
    const videoID = req.params.videoID;
    
    if (!videoID) {
        return res.status(400).send('Video ID not provided.');
    }

    try {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.API_KEY,
                'x-rapidapi-host': process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === 'ok') {
            const fileURL = fetchResponse.link;
            const fileName = fetchResponse.title + '.mp3';
            const filePath = path.join(__dirname, 'downloads', fileName);

            const fileStream = fs.createWriteStream(filePath);

            const downloadResponse = await fetch(fileURL);
            downloadResponse.body.pipe(fileStream);

            downloadResponse.body.on('end', () => {
                res.download(filePath, fileName, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error during download.');
                    }
                    fs.unlinkSync(filePath);
                });
            });
        } else {
            res.status(400).send('Error: ' + fetchResponse.msg);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

app.listen(PORT, () => {
    console.log('Server on port 3000');
});
      
