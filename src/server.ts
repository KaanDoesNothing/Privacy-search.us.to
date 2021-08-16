import express from "express";
import path from "path";
export const app: express = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/website/views"));
app.use("/static", express.static(path.join(__dirname, "/website/public")));

export const start = async (port: number = 7009) => {
    try {
      await app.listen(port)
    } catch (err) {
      console.log(err);
      process.exit(1)
    }
  }