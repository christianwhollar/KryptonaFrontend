const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });  // Files will be temporarily saved to an 'uploads' folder

app.use(cors());
app.use(express.json());

// Route to receive files and print a received message
app.post('/api/pinFileToIPFS', upload.single('file'), async (req, res) => {
    if (req.file) {
        console.log('File received:', req.file);
        const ipfshash = await uploadToIPFS(req.file.path, req.file.originalname);
        console.log(ipfshash)
        res.status(200).send({ message: 'File uploaded successfully', ipfsHash: ipfshash });
    } else {
        console.log('No file received');
        res.status(400).send('No file uploaded');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

async function uploadToIPFS(filePath, fileName) {
  try {
    const formData = new FormData();
    const fileStream = fs.createReadStream(filePath);
    formData.append("file", fileStream, fileName);

    const pinataMetadata = JSON.stringify({
      name: fileName,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlOTU4MDMzNi1hZTQ0LTRmNTQtYjdlZS1kODkzZTVlYmQ3YjAiLCJlbWFpbCI6ImNocmlzdGlhbi5ob2xsYXJAZHVrZS5lZHUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZTYyOTZhNTFiNzc0YTQzYzg4MTkiLCJzY29wZWRLZXlTZWNyZXQiOiJiZjNjNWVhN2Q5MzFlYzZjYzAwNmQ0YTAxODQwMjRiNGEyMzdiYTk1NzM1ZTMxMjVhNTA4ZmJlNjVjZGYzNTVmIiwiaWF0IjoxNzEzMTk5ODM2fQ.waf1RNbUL9NPf29HtkoTdwENozkOzZPdZnYVL1jeOmw`,
          ...formData.getHeaders(),
        },
      }
    );
    console.log('IPFS Upload Success:', response.data);
    console.log(response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('IPFS Upload Error:', error);
  }
}
