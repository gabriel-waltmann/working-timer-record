import config from "./config";
import Queue from "bull";

const queue = new Queue("workspace-timers", config);

queue.on("error", (err) => {
  console.error(err);
});

queue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

export default queue;
