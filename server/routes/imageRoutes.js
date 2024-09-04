import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

async function createImage(prompt) {
  const resp = await fetch(`https://api.limewire.com/api/image/generation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Version": "v1",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.LIMEWIRE_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      aspect_ratio: "1:1",
    }),
  });

  const data = await resp.json();
  console.log(data);
}

router.route("/").get((req, res) => {
  res.send("Hello from iGEN!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await createImage(prompt);
    const image = aiResponse.data[0].asset_url;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.error?.message || "An unexpected error occurred";
    res.status(500).send(errorMessage);
  }
});

export default router;
