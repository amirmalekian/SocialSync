import express, { Application } from "express";
import configure from "./config";
import router from "./routes";
import * as dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
configure(app, express);

app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
