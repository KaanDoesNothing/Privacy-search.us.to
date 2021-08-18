import { io, app } from "../../server";
import manager_input from "./input";
import manager_browser from "./browser";
import manager_screen from "./screen";
import manager_navigation from "./navigation";
import manager_page from "./page";
import { cache } from "./cache";
import path from "path/posix";

io.on("connection", async (socket) => {
    socket.emit("event", {type: "status_change", data: "Starting"});
    
    let browser = await manager_browser();
    let page = await manager_page(browser);

    cache.set(socket.id, browser);

    socket.emit("event", {type: "status_change", data: "Running"});
    socket.emit("event", {type: "browser_loaded"});

    manager_input({browser, page, socket});
    manager_screen({page, socket});
    manager_navigation({page, socket});

    socket.on("disconnect", async () => {
        await browser.close();

        cache.delete(socket.id);
    });

    console.log("Connected");
});