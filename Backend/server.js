const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

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
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
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
