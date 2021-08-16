const socket = io();

function getMousePosition() {
    let event = window.event;

    return {
        x: event.clientX,
        y: event.clientY
    };
}

$(document).on("scroll", (e) => {
    console.log(e);
});

$("#screen").on("mousemove", () => {
    socket.emit("input", {
        type: "mouse_move",
        ...getMousePosition()
    });
});

$("#screen").on("click", () => {
    socket.emit("input", {
        type: "mouse_click",
        ...getMousePosition()
    });
});

$(document).keyup((e) => {
    e.preventDefault();

    socket.emit("input", {
        type: "key",
        key: e.which,
        action: "up"
    });
});

$(document).keydown((e) => {
    e.preventDefault();

    console.log(e.which);

    socket.emit("input", {
        type: "key",
        key: e.which,
        action: "down"
    });
});

socket.on("connection", () => {
    console.log("Conencted");
});

socket.on("browser_loaded", () => {
    let body = document.querySelector("#screen");
    let data = {
        width: $("#screen").width(),
        height: $("#screen").height()
    };
    console.log(data);
    socket.emit("set_screen_size", data);
});

socket.on("screen_size_updated", () => {
    socket.emit("goto", "https://www.duckduckgo.com/");
});

socket.on("update_frame", (image) => {
    var blob = new Blob([image])

    var reader = new FileReader();
    reader.onload = function (event) {
        var base64 = event.target.result
        let img = document.querySelector("#screen");
        img.src = base64;
    };

    reader.readAsDataURL(blob);
});