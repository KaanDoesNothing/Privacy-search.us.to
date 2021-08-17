import { keyboardMap } from "../keyboardmap";

export default ({browser, page, socket}) => {
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
}