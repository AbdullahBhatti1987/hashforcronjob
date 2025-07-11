const axios = require("axios");

(async () => {
  try {
    await axios.post(
      "https://hashfor-dusky.vercel.app/api/cron-daily",
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`
        }
      }
    );
    console.log("✅ Task ran successfully at", new Date().toISOString());
  } catch (error) {
    console.error("❌ Task failed:", error.message);
    process.exit(1);
  }
})();
