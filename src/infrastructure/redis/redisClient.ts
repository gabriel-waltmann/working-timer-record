import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost', 
  port: 6379,      
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
