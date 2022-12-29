import Express from "express";
import dotenv from 'dotenv';

import CookieParser from 'cookie-parser';
import Irouter from "./Routers/InstituteRoutes.js";
import Aroutes from "./Routers/AdminRoutes.js";
import Srouter from "./Routers/StudentRoutes.js";
import cors from 'cors'
import { Server } from "socket.io";
import http from 'http';
import { SocketFunction } from './SocketIo.js';
import { CRoutes } from "./Routers/CommonRoutes.js";
import { Realtions } from "./Conn/Relations.js";
import path from 'path';
import { fileURLToPath } from 'url';
import stripe from "stripe";
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "./Config/config.env" })
}

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

const app = Express();
const server = http.createServer(app)
const CorsOptions = {
  cors: {
    origin: ["http://localhost:3000/"],
    credentials: true,
  }
}

const io = new Server(server, { ...CorsOptions });

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
const Port = process.env.PORT || 9000

SocketFunction(io)
app.use(cors());
app.use(CookieParser())
app.use(Express.urlencoded({ limit: "50mb", extended: true }));
app.use(Express.json({ limit: "50mb" }))
app.use('/api', Irouter);
app.use('/api', Aroutes)
app.use('/api', Srouter);
app.use('/api', CRoutes) 

   
app.use(Express.static(path.join(__dirname, "../client-4/build")))
Realtions();
if (process.env.NODE_ENV === 'production') {
  const a = path.join(__dirname, "../client-4/build/index.html")
  app.get("*", (req, res) => {

    res.sendFile(a);
  });
}

server.listen(Port, () => {
  console.log(`App  is  runnging on port ${Port}`)
});