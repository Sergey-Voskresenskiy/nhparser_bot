import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join("./", ".env") });

const { setupBot } = require('./bot');

(async function () {
  try {
    await setupBot().launch();

    console.clear();
    console.log("🌱 Startup success");
  } catch (error) {
    console.clear();
    console.log("❌ Startup error: ",  error);

    process.once("SIGINT", () => setupBot.stop("SIGINT"));
    process.once("SIGTERM", () => setupBot.stop("SIGTERM"));
  }
})();