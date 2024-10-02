import express from 'express';
import connectMongoDB from './infrastructure/database/mongoose';
import routes from './interfaces/routes/index';
import dotenv from 'dotenv';
import swagger from './swagger';

const app = express();

app.use(express.json());

app.use("/", routes);

dotenv.config();

const startServer = async () => {
  await connectMongoDB();

  swagger(app);

  app.listen(3000, () => {
    console.info('Server is running on port 3000');
  });
};

startServer();
