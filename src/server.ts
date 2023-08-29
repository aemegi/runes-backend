import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";

import { runeRouter } from "./rune.routes";
 
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
 
const { ATLAS_URI } = process.env;
 
if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}
 
connectToDatabase(ATLAS_URI)
   .then(() => {
       const app = express();
       app.use(cors());
       app.use("/runes", runeRouter);
       // start the Express server
       app.listen(3000, () => {
           console.log(`Server running at http://localhost:3000...`);
       });
 
   })
   .catch(error => console.error(error));