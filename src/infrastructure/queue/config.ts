import dotenv from "dotenv";
import Queue from "bull";

dotenv.config();

const config: Queue.QueueOptions = {
  redis: {
    password: process.env.REDIS_PASSWORD || "",
    username: process.env.REDIS_USERNAME || "default",
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
  }
};

export default config;
