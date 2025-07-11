// const axios = require("axios");

// (async () => {
//   try {
//     await axios.post(
//       "https://hashfor-dusky.vercel.app/api/cron-daily",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CRON_SECRET}`
//         }
//       }
//     );
//     console.log("✅ Task ran successfully at", new Date().toISOString());
//   } catch (error) {
//     console.error("❌ Task failed:", error.message);
//     process.exit(1);
//   }
// })();


const axios = require("axios");
const { DateTime } = require("luxon");

const TZ = "Europe/Nicosia";   // Cyprus time zone
let lastRunISODate = null;     // remember last successful run (YYYY‑MM‑DD)

/**
 * Runs every minute, but executes the task ONLY when:
 *   ▸ today is Monday–Friday
 *   ▸ local Cyprus time is exactly 02 : 00 (minute = 0)
 *   ▸ and it hasn’t already run today
 */
setInterval(async () => {
  const now = DateTime.now().setZone(TZ);
  const isWeekday = now.weekday >= 1 && now.weekday <= 5; // 1=Mon … 5=Fri
  const isTwoAM   = now.hour === 2 && now.minute === 0;
  const todayISO  = now.toISODate();                      // e.g. "2025-07-12"

  if (isWeekday && isTwoAM && todayISO !== lastRunISODate) {
    lastRunISODate = todayISO;          // prevent double‑run in same day
    console.log("⏰ Running task for", todayISO, "at", now.toISOTime());

    try {
      await axios.post(
        "https://hashfor-dusky.vercel.app/api/cron-daily",
        {},
        { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } }
      );
      console.log("✅ Task finished OK");
    } catch (err) {
      console.error("❌ Task failed:", err.message);
      //  ↳ decide if you want to reset lastRunISODate here on failure
    }
  }
}, 60 * 1000); // check once per minute
