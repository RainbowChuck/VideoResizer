const buttons = document.querySelectorAll("button[data-mode]");

function updateButtons(mode) {
    buttons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.mode === mode
        );
    });
}

browser.storage.local.get("mode").then(result => {
    updateButtons(result.mode || "auto");
});

buttons.forEach(button => {
    button.addEventListener("click", async () => {
        const mode = button.dataset.mode;
        await browser.storage.local.set({ mode });
        updateButtons(mode);
    });
});

