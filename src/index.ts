import express from "express";
import connectMongoDB from "./infrastructure/database/mongoose";
import routes from "./interfaces/routes/index";
import dotenv from "dotenv";
import swagger from "./swagger";

const app = express();

app.use(express.json());

app.use("/", routes);

dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  swagger(app);

  app.listen(port, () => {
    console.info(`Server is running at http://localhost:${port}`);
  });
};

startServer();
