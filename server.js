const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/currencies", async (req, res) => {
  try {
    const response = await axios.get(process.env.CURRENCY_LIST_URL);
    const currencies = response.data.map((coin) => {
      return { name: coin.name, id: coin.id };
    });
    res.json({ currencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching currencies" });
  }
});

app.get("/api/supported-currencies", async (req, res) => {
  try {
    console.log(process.env.SUPPORTED_CURRENCY_URL);
    const response = await axios.get(process.env.SUPPORTED_CURRENCY_URL);
    const supportedCurrencies = response.data; // Flatten the object
    res.json({ supportedCurrencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching supported currencies" });
  }
});

app.post("/api/convert", async (req, res) => {
  try {
    const { source, amount, target } = req?.body;
    if (!source || !amount || !target) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure valid currency codes (adjust according to API requirements)
    const validSource = source; // Adjust case if needed
    const validTarget = target;
    console.log(validSource, validTarget);
    // API call with potential error handling
    let response;
    try {
      response = await axios.get(
        `${process.env.CONVERSION_URL}ids=${validSource}&vs_currencies=${validTarget}`
      );
    } catch (error) {
      console.error("API error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching conversion rate" });
    }
    console.log(response?.data);
    // Check for valid response and data
    if (
      !response?.data ||
      !response.data[validSource] ||
      !response.data[validSource][validTarget]
    ) {
      return res
        .status(400)
        .json({ message: "Invalid source or target currency" });
    }

    const conversionRate = response.data[validSource][validTarget];
    const convertedAmount = parseFloat(amount) * conversionRate;

    // ... rest of your conversion logic

    res.json(convertedAmount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error performing conversion" });
  }
});

app.listen(8003, () => {
  console.log("Server i srunning on 8002");
});
