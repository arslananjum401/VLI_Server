import Express from "express";
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';
import Irouter from "./Routers/InstituteRoutes.js";
import Aroutes from "./Routers/AdminRoutes.js";
import Srouter from "./Routers/StudentRoutes.js";
import cors from 'cors'
import http from 'http';
import { SocketFunction } from './SocketIo.js';
import { CRoutes } from "./Routers/CommonRoutes.js";
import { Realtions } from "./Conn/Relations.js";
import path from 'path';
import { fileURLToPath } from 'url';
import stripe from "stripe";
import { Server as SocketServer } from "socket.io";
import { AdminEvents } from "./Events/Admin/Admin.js";
import { StudentEvents } from "./Events/Student/Student.js";
import { StaffEvents } from "./Events/Institute/Staff/Staff.js";
import { InstituteAdminEvents } from "./Events/Institute/Admin/Admin.js";
const app = Express();
import './Server.js';
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:9000"],
  credentials: true,
}))
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "./Config/config.env" })
}

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const Stripe = stripe(process.env.STRIPE_SECRET_KEY)


const server = http.createServer(app)
const CorsOptions = {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:9000"],
    credentials: true,
  }
}
export const io = new SocketServer(server, { ...CorsOptions });
export const Admin = io.of('/admin');
export const InstituteAdmin = io.of('/institute/admin');
export const InstituteStaff = io.of('/institute/staff');
export const InstituteInstructor = io.of('/institute/instructor');

AdminEvents(Admin);
StudentEvents(io)
InstituteAdminEvents(InstituteAdmin)
StaffEvents(InstituteStaff)



const Port = process.env.PORT || 9000

app.options(cors());

app.use(CookieParser())
app.use(Express.urlencoded({ limit: "5mb", extended: true }));
app.use(Express.json({ limit: "5mb" }));

app.use('/api', Irouter);
app.use('/api', Aroutes);
app.use('/api', Srouter);
app.use('/api', CRoutes)
Realtions();

app.use(Express.static(path.join(__dirname, "./build")))
if (process.env.NODE_ENV === 'production') {
  const a = path.join(__dirname, "./build/index.html")
  app.get("*", (req, res) => {

    res.sendFile(a);
  });
}

server.listen(Port, () => console.log(`App  is  runnging on port ${Port}`)); 