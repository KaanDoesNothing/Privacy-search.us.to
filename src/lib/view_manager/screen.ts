import { Page } from "puppeteer";
import { Socket } from "socket.io";
import { cache } from "./cache";

export default ({page, socket}: {page: Page, socket: Socket}) => {
    let interval;

    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data).catch(err => console.log("Couldn't set viewport!"));
        
        socket.emit("event", {type: "update_screen_size"});

        interval = setInterval(async () => {
            try {
                if(page.isClosed()) return clearInterval(interval);
                let viewport = page.viewport();

                if(viewport.width === 0 && viewport.height === 0) return;

                const screenshot = await page.screenshot({
                    fullPage: false,
                    omitBackground: false,
                    quality: 20,
                    type: "jpeg"
                });

                socket.emit("event", {type: "update_screen", data: screenshot});
            }catch(err) {
                console.log(err);
                clearInterval(interval);
                console.log("Screenshot error");
            }
        }, 200);
    });
}