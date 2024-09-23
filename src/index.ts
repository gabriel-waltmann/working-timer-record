import express from 'express';
import connectMongoDB from './infrastructure/database/mongoose';
import { connectRedis } from './infrastructure/redis/redisClient';
import routes from './interfaces/routes/index'

const app = express();

app.use(express.json());

app.use("/", routes)

const startServer = async () => {
  await connectMongoDB();

  await connectRedis(); 

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer();
