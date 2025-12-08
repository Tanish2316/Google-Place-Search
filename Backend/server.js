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
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location,places.addressComponents",
        },
      }
    );

    res.json(googleRes.data);
  } catch (error) {
    console.error("Error fetching Google Places data:", error);
    res.status(500).json({ error: "Failed to fetch Google Places data" });
  }
});

app.post("/get-mapbox-details", async (req, res) => {
  const { latitude, longitude } = req.body;
  const mapboxApiKey = process.env.MAPBOX_API_KEY;
  const session_token = uuidv4();

  try {
    const mapboxRes = await axios.get(
      `https://api.mapbox.com/search/searchbox/v1/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${mapboxApiKey}&limit=1&types=poi,address,place`
    );

    const item = mapboxRes?.data?.features[0]?.properties;
    const mapboxId = item?.mapbox_id;

    const mapboxDetails = await axios.get(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${mapboxApiKey}&session_token=${session_token}`
    );

    const mapboxDetailsData = mapboxDetails?.data?.features[0]?.properties;
    const country = mapboxDetailsData?.context?.country?.name || "";
    const city = mapboxDetailsData?.context?.place?.name || "";
    const pincode = mapboxDetailsData?.context?.postcode?.name || "";
    const state = mapboxDetailsData?.context?.region?.name || "";
    const lat = mapboxDetailsData?.coordinates?.latitude || "";
    const long = mapboxDetailsData?.coordinates?.longitude || "";
    const alternativeAddressLine1 = mapboxDetailsData.name || "";
    const alternativeAddressLine2 =
      mapboxDetailsData?.context?.neighborhood?.name ||
      mapboxDetailsData?.context?.locality?.name ||
      "";

    let address =
      mapboxDetailsData?.full_address ||
      mapboxDetailsData?.place_formatted ||
      "";

    let cleanAddress = address
      .replace(country, "")
      .replace(city, "")
      .replace(state, "")
      .replace(pincode, "")
      .replace(/,+/g, ",")
      .trim();

    if (cleanAddress.endsWith(",")) {
      cleanAddress = cleanAddress.slice(0, -1).trim();
    }

    const parts = cleanAddress
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const half = Math.ceil(parts.length / 2);
    let addressLine1 = parts.slice(0, half).join(", ");
    let addressLine2 = parts.slice(half).join(", ");

    if (addressLine2.trim() === "" && addressLine1.trim() !== "") {
      addressLine2 = addressLine1;
      addressLine1 = alternativeAddressLine1;
    }

    if (addressLine1.trim() === "") {
      addressLine1 = alternativeAddressLine1;
      addressLine2 = alternativeAddressLine2;
    }

    res.json({
      displayName: mapboxDetailsData.name || "",
      addressline1: addressLine1,
      addressline2: addressLine2,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
      latitude: lat,
      longitude: long,
      mapboxId: mapboxId,
    });
  } catch (error) {
    console.error("Error fetching Mapbox details:", error);
    res.status(500).json({ error: "Failed to fetch Mapbox details" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
