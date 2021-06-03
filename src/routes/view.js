const { Router } = require("express");

const io = require("socket.io")();

io.listen(5002);

const app = module.exports = Router();

app.get("/", (req, res) => {
    res.render("view/index");
});