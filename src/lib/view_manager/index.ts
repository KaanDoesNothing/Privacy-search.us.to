import { io, app } from "../../server";
import manager_input from "./input";
import manager_browser from "./browser";
import manager_screen from "./screen";
import manager_navigation from "./navigation";
import manager_page from "./page";
import { cache } from "./cache";
import path from "path";

app.get("/view/screen/:id", async (req, res) => {
    let browser = cache.get(req.params.id);

    if(!browser) return res.send("Error browser doesn't exist");

    let page = (await browser.pages())[0];

    if(!page) return res.send("Error page doesn't exist");
    
    const screenshot = await page.screenshot({
        fullPage: false,
        omitBackground: false,
        quality: 20,
        type: "jpeg"
    });

    res.set({
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=screenshot.png"
    });
    
    return res.send(screenshot);
});

io.on("connection", async (socket) => {
    socket.emit("event", {type: "status_change", data: "Starting"});
    
    let browser = await manager_browser();
    let page = await manager_page(browser);

    cache.set(socket.id, browser);

    socket.emit("event", {type: "status_change", data: "Running"});
    socket.emit("event", {type: "browser_loaded"});

    // manager_input({browser, page, socket});
    manager_screen({page, socket});
    manager_navigation({page, socket});

    socket.on("disconnect", async () => {
        await browser.close();

        cache.delete(socket.id);
    });

    console.log("Connected");
});