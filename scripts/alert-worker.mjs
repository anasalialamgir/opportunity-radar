const origin = process.env.WORKER_APP_URL || "http://app:3000";
const secret = process.env.CRON_SECRET;
if (!secret) { console.error("CRON_SECRET is required"); process.exit(1); }
const interval = Math.max(15, Number(process.env.SCAN_INTERVAL_MINUTES || 360)) * 60000;
async function run() {
  try {
    const response = await fetch(`${origin}/api/cron/scan`, { method: "POST", headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(300000) });
    console.log("Alert scan:", response.status, await response.text());
    return response.ok;
  } catch (error) { console.error("Alert scan failed:", error); }
  return false;
}
while (!await run()) await new Promise(resolve => setTimeout(resolve, 30000));
setInterval(run, interval);
