const express = require("express");
const cors = require("cors");
const axios = require("axios");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const secretKey = process.env.SECRET_KEY || "default_secret_key";
const encrypted = process.env.GOOGLE_API_KEY;

const GOOGLE_API_KEY = CryptoJS.AES.decrypt(encrypted, secretKey).toString(
  CryptoJS.enc.Utf8
);

app.use(cors());
app.use(express.json());

app.post("/search", async (req, res) => {
  const reqBody = req.body;

  const googleRes = await axios.post(
    "https://places.googleapis.com/v1/places:searchText",
    reqBody,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.addressComponents",
      },
    }
  );

  res.json(googleRes.data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
