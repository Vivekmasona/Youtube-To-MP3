const express = require('express');
const app = express();
const request = require('request');

app.get('/Mp3', (req, res) => {
  // Extract the YouTube link from the 'url' query parameter
  const ytLink = req.query.url;

  const options = {
    method: 'GET',
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    qs: { id: ytLink }, // Use the extracted YouTube link
    headers: {
      'X-RapidAPI-Key': '650590bd0fmshcf4139ece6a3f8ep145d16jsn955dc4e5fc9a',
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      res.status(500).send('Error');
    } else {
      res.send(body);
    }
  });
});

const PORT = 3000; // You can use any port you prefer
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

