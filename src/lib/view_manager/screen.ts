import { cache } from "./cache";

export default ({page, socket}) => {
    let interval;

    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data).catch(err => console.log("Couldn't set viewport!"));
        
        socket.emit("screen_size_updated");

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
        
                socket.emit("update_frame", screenshot);
            }catch(err) {
                console.log("Screenshot error");
            }
        }, 500);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected.");
        clearInterval(interval);
    });

}