export default ({page, socket, cache}) => {
    socket.on("goto", (url) => {
        page.goto(url).catch(err => console.log("Browser disconnected!"));
    });
}