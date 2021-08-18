import { io, app } from "../../server";
import manager_input from "./input";
import manager_browser from "./browser";
import manager_screen from "./screen";
import manager_navigation from "./navigation";
import manager_page from "./page";
import { cache } from "./cache";

let browser;

io.on("connection", async (socket) => {
    socket.emit("status", "Starting");
    
    if(!browser) browser = await manager_browser();
    let page = await manager_page(browser);

    cache.set(socket.id, browser);

    socket.emit("status", "Running");
    socket.emit("browser_loaded", true);

    manager_input({browser, page, socket});
    manager_screen({page, socket});
    manager_navigation({page, socket});

    socket.on("disconnect", async () => {
        let pages = await browser.pages();

        if(pages.length === 2) {
            console.log("Browser closed");
            await browser.close();
        }else {
            console.log("Tab closed");
            await page.close();
            console.log(pages.length);
        }

        cache.delete(socket.id);
    });

    console.log("Connected");
});