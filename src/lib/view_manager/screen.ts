export default ({page, socket, cache}) => {
    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data);
        
        socket.emit("screen_size_updated");

        cache["interval"] = setInterval(async () => {
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
        }, 500);
    });

}