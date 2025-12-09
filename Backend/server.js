const express = require("express");
const cors = require("cors");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
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

  try {
    const googleRes = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      reqBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "*",
        },
      }
    );

    res.json(googleRes.data);
  } catch (error) {
    console.error("Error fetching Google Places data:", error);
    res.status(500).json({ error: "Failed to fetch Google Places data" });
  }
});

app.get("/get-google-details/:placeId", async (req, res) => {
  const { placeId } = req.params;

  try {
    const mapboxRes = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "*",
        },
      }
    );

    const googleDetails = mapboxRes.data;

    res.json(googleDetails);
  } catch (error) {
    console.error("Error fetching Mapbox details:", error);
    res.status(500).json({ error: "Failed to fetch Mapbox details" });
  }
});

app.post("/get-city-state-country", async (req, res) => {
  const { input, category } = req.body;
  try {
    const googleRes = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete`,
      {
        input: input,
        includedPrimaryTypes: category,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "*",
        },
      }
    );
    res.json(googleRes.data);
  } catch (error) {
    console.error("Error fetching Google Geocode data:", error);
    res.status(500).json({ error: "Failed to fetch Google Geocode data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
