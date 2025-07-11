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


// const axios = require("axios");
// const { DateTime } = require("luxon");

// const TZ = "Europe/Nicosia";   // Cyprus time zone
// let lastRunISODate = null;     // remember last successful run (YYYY‑MM‑DD)

// /**
//  * Runs every minute, but executes the task ONLY when:
//  *   ▸ today is Monday–Friday
//  *   ▸ local Cyprus time is exactly 02 : 00 (minute = 0)
//  *   ▸ and it hasn’t already run today
//  */
// setInterval(async () => {
//   const now = DateTime.now().setZone(TZ);
//   const isWeekday = now.weekday >= 1 && now.weekday <= 5; // 1=Mon … 5=Fri
//   const isTwoAM   = now.hour === 2 && now.minute === 0;
//   const todayISO  = now.toISODate();                      // e.g. "2025-07-12"

//   if (isWeekday && isTwoAM && todayISO !== lastRunISODate) {
//     lastRunISODate = todayISO;          // prevent double‑run in same day
//     console.log("⏰ Running task for", todayISO, "at", now.toISOTime());

//     try {
//       await axios.post(
//         "https://hashfor-dusky.vercel.app/api/cron-daily",
//         {},
//         { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } }
//       );
//       console.log("✅ Task finished OK");
//     } catch (err) {
//       console.error("❌ Task failed:", err.message);
//       //  ↳ decide if you want to reset lastRunISODate here on failure
//     }
//   }
// }, 60 * 1000); // check once per minute





const axios = require("axios");
const { DateTime } = require("luxon");

const TZ          = "Asia/Karachi"; // Pakistan time zone (UTC+5, no DST)
const TARGET_HOUR = 21;             // 9 PM
const TARGET_MIN  = 15;             // :15
let   lastRunISO  = null;           // remember last successful run (YYYY‑MM‑DD)

/**
 * Checks every minute:
 *   ▸ Monday–Friday only
 *   ▸ exactly 21:15 Asia/Karachi
 *   ▸ skips if it already ran today
 */
setInterval(async () => {
  const now        = DateTime.now().setZone(TZ);
  const isWeekday  = now.weekday >= 1 && now.weekday <= 5;   // 1=Mon … 5=Fri
  const at915PM    = now.hour === TARGET_HOUR && now.minute === TARGET_MIN;
  const todayISO   = now.toISODate();                        // "YYYY‑MM‑DD"

  if (isWeekday && at915PM && todayISO !== lastRunISO) {
    lastRunISO = todayISO;
    console.log("⏰ Running test task on", todayISO, "at", now.toISOTime());

    try {
      await axios.post(
        "https://hashfor-dusky.vercel.app/api/cron-daily",
        {},
        { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } }
      );
      console.log("✅ Test task finished OK");
    } catch (err) {
      console.error("❌ Test task failed:", err.message);
      // optional: lastRunISO = null;  // re‑attempt later if needed
    }
  }
}, 60 * 1000); // run checker every minute
