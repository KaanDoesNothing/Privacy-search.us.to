import express from "express";
import { createServer } from "http";
import path from "path";
import * as socketIO from "socket.io";

export const app: express = express();
export const server = createServer(app);
export const io: socketIO.Server = require("socket.io")(server);

import "./lib/view_manager";

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "/website/views"));
app.use("/static", express.static(path.join(__dirname, "..", "/website/public")));

export const start = async (port: number = 7009) => {
  try {
    await server.listen(port)
  } catch (err) {
    console.log(err);
    process.exit(1)
  }
}

export const appVersion = Date.now();