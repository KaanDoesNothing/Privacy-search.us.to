import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import puppeteer from "puppeteer";
import { io } from "../server";
import { keyboardMap } from "./keyboardmap";
import crossfetch from "cross-fetch";
import applyEvasions from "./applyEvasions";

io.on("connection", async (socket) => {
    let interval;
    console.log("Connected");

    let browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--single-process"]});
    let page = (await browser.pages())[0];

    let blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(crossfetch);
    
    await blocker.enableBlockingInPage(page);
    await applyEvasions(page);
    // await page.setViewport({width: 1280, height: 720});

    socket.emit("browser_loaded", true);

    socket.on("input", async (data) => {
        if(data.type === "mouse_move") {
            await page.mouse.move(data.x, data.y);
        }else if(data.type === "mouse_click") {
            await page.mouse.click(data.x, data.y);
        }else if(data.type === "key" && data.action) {
            let key = keyboardMap[data.key];

            if(key === "Up" || key === "Down") {
                if(key === "Down") {
                    await page.evaluate(() => {
                        window.scrollBy(0, 100); 
                    });
                }

                if(key === "Up") {
                    await page.evaluate(() => {
                        window.scrollBy(0, -100); 
                    });
                }
                return;
            }

            if(data.action === "up") {
                //@ts-ignore
                await page.keyboard.up(key).catch(err => console.log(`Error key: ${key}`));
            }else {
                //@ts-ignore
                await page.keyboard.down(key).catch(err => console.log(`Error key: ${key}`));
            }
        }
    });

    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data);
        
        socket.emit("screen_size_updated");

        interval = setInterval(async () => {
            try {
                let viewport = page.viewport();

                if(viewport.width === 0 && viewport.height === 0) return;

                const screenshot = await page.screenshot({
                    fullPage: false,
                    omitBackground: false,
                    quality: 20,
                    type: "jpeg"
                });
        
                socket.emit("update_frame", screenshot);
            }catch(err) {
                console.log("Screenshot error");
            }
        }, 100);
    });

    socket.on("goto", (url) => {
        page.goto(url).catch(err => console.log("Browser disconnected!"));
    });

    socket.on("disconnect", async () => {
        clearInterval(interval);
        await browser.close();
    });
    // socket.emit("screen_update", {frame: })
});