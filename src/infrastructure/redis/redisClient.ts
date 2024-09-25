import Redis from 'ioredis';
import { EndTimerUseCase } from '../../application/use-cases/workspace-timer/end-timer-use-case';
import { MongoWorkspaceTimerRepository } from '../database/workspace-timer-repository-impl';

const host: string = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;

const redisClient = new Redis({ host, port });

const redisSubscriber = new Redis({ host, port });

redisSubscriber.subscribe('__keyevent@0__:expired', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to Redis keyevent', err);
  } else {
    console.log(`Subscribed to ${count} Redis keyevent channels.`);
  }
});

// * redis key expiration
redisSubscriber.on('message', async (channel, message) => {
  if (channel === '__keyevent@0__:expired') {
    // Extract the timer ID from the Redis key
    const timerId = parseInt(message.split(':')[1], 10);

    console.log(`Workspace timer expired (id: ${timerId})`);

    if (!isNaN(timerId)) {
      await handleTimerExpiration(timerId);
    }
  }
});

// * redis connection
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// * redis error
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const connectRedis = async () => {
  if (redisClient.status === 'connecting' || redisClient.status === 'connect') {
    console.log('Redis is already connecting/connected');
    return;
  }

  await redisClient.connect();

  console.log('Redis connected');
};

async function handleTimerExpiration(workspaceTimerId: number): Promise<void> {
  const workspaceTimerRepository = new MongoWorkspaceTimerRepository();

  const endTimerUseCase = new EndTimerUseCase(workspaceTimerRepository);

  await endTimerUseCase.execute(workspaceTimerId);
}

export default redisClient;
