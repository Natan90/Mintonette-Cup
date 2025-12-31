const express = require("express");
const axios = require("axios");
const router = express.Router();


router.use(express.json());

router.post("/libretranslate", async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text"
    });
    console.log("LibreTranslate response:", response.data);
    res.json({ translatedText: response.data.translatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur traduction" });
  }
});

module.exports = router;
