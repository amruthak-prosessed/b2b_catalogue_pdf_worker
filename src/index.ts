import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { renderCatalog } from "./renderCatalog";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    realtime: {
      transport: WebSocket,
    },
  }
);


console.log("URL:", process.env.SUPABASE_URL);
console.log(
  "KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20)
);

const POLL_INTERVAL =
  Number(process.env.POLL_INTERVAL_MS) || 5000;

  async function pollJobs() {
  console.log("Checking for queued jobs...");

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      console.log("No queued jobs.");
      return;
    }

    console.error(error);
    return;
  }

  console.log("Found Job:");
  console.log(job);

  await processJob(job);
}
async function processJob(job: any) {
  try {
   await supabase
    .from("jobs")
    .update({
      status: "processing",
      progress: 10,
      started_at: new Date().toISOString(),
      error_msg: null,
    })
    .eq("id", job.id);

    await renderCatalog(job.catalog_id);

    await supabase
    .from("jobs")
    .update({
      status: "completed",
      progress: 100,
      finished_at: new Date().toISOString(),
      error_msg: null,
    })
    .eq("id", job.id);

  console.log("Job completed.");
  } catch (error: any) {
    console.error(error);
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error_msg:
          error?.message ??
          "Unknown PDF generation error",
        finished_at: new Date().toISOString(),
      })
      .eq("id", job.id);
  }
}

pollJobs();

setInterval(
  pollJobs,
  POLL_INTERVAL
);