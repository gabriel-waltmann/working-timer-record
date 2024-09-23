import Redis from 'ioredis';

const host: string = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;

const redisClient = new Redis({
  host,
  port,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Export a function that connects to Redis only if not connected
export const connectRedis = async () => {
  if (redisClient.status === 'connecting' || redisClient.status === 'connect') {
    console.log('Redis is already connecting/connected');
    return;
  }

  await redisClient.connect();
  console.log('Redis connected');
};

export default redisClient;
