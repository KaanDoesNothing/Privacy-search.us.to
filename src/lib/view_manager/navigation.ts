export default ({page, socket, cache}) => {
    socket.on("goto", async (url) => {
        console.log("test");
        await page.goto(url).catch(err => console.log("Browser disconnected!"));
    });

    socket.on("go_back", async () => {
        await page.goBack();
    });

    socket.on("go_forward", async () => {
        await page.goForward();
    });

    socket.on("reload", async () => {
        await page.reload();
    });
}