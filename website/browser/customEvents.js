document.addEventListener("click", () => {
    if(document.activeElement.tagName === "input") {
        window.onCustomEvent({type: "isTyping"})
    }
})