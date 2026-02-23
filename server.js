const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "15mb" }));
app.use(express.static("public"));

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}!`);
});

app.post("/upload", async (req, res) => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    await channel.send({
      content: "📸 Nouvelle capture pédagogique",
      files: [{ attachment: buffer, name: "capture.png" }]
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});