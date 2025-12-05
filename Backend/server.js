const express = require("express");
const cors = require("cors");
const axios = require("axios");

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
        "X-Goog-Api-Key": "AIzaSyC-qf9BUy1fCE8p48TTdNAPE4rBGQ86tgQ",
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
