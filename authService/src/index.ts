import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import { router } from "./routes";

env.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Listening on port: ' +  PORT);
});