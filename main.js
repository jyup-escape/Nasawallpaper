const axios = require('axios');
const wallpaper = require('wallpaper');
const fs = require('fs');
const path = require('path');

const API_KEY = "you api key";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

async function fetchNasaImage() {
    try {
        const response = await axios.get(API_URL);
        const imageUrl = response.data.url;
        const imageTitle = response.data.title.replace(/[^a-zA-Z0-9]/g, "_");

        const ext = path.extname(imageUrl).split("?")[0] || ".jpg";
        const filePath = path.join(__dirname, `${imageTitle}${ext}`);

        const imageResponse = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream",
        });

        const writer = fs.createWriteStream(filePath);
        imageResponse.data.pipe(writer);

        writer.on("finish", async () => {
            console.log(`✅ 画像を保存しました: ${filePath}`);
            await setWallpaper(filePath);
        });

        writer.on("error", (err) => console.error("❌ 画像の保存に失敗:", err));

    } catch (error) {
        console.error("エラーが発生しました:", error.message);
    }
}

async function setWallpaper(imagePath) {
    try {
        await wallpaper.setWallpaper(imagePath); 
        console.log("✅ 壁紙を変更しました:", imagePath);
    } catch (error) {
        console.error("❌ 壁紙の変更に失敗:", error);
    }
}

fetchNasaImage();
// v0.0.1 © 2025 jyup
// module => nasa wallpapper axios fs path
