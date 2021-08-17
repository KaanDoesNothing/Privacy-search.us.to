import { io } from "../../server";
import manager_input from "./input";
import manager_browser from "./browser";
import manager_screen from "./screen";
import manager_navigation from "./navigation";
import manager_page from "./page";

io.on("connection", async (socket) => {
    let cache = {};

    let browser = await manager_browser();
    let page = await manager_page(browser);

    socket.emit("browser_loaded", true);

    manager_input({browser, page, socket});
    manager_screen({page, socket});
    manager_navigation({page, socket});

    socket.on("disconnect", async () => {
        clearInterval(cache["interval"]);
        await browser.close();
    });

    console.log("Connected");
});