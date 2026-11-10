
(() => {
    const selector = 'iframe[src*="play.boomstream.dev"]';
    const observers = new Map();
    let mode = "auto";

    function resize(player, container) {
        if (mode === "off") {
            player.style.removeProperty("width");
            player.style.removeProperty("height");
            player.style.removeProperty("max-width");
            player.style.removeProperty("max-height");
            player.style.removeProperty("display");
            player.style.removeProperty("margin");
            return;
        }

        const availableWidth = container.getBoundingClientRect().width;
        if (availableWidth <= 0) return;

        const factor = mode === "compact" ? 0.75 : 1;
        const width = availableWidth * factor;

        player.style.setProperty("width", `${width}px`, "important");
        player.style.setProperty("height", `${width * 9 / 16}px`, "important");
        player.style.setProperty("max-width", "100%", "important");
        player.style.setProperty("max-height", "none", "important");
        player.style.setProperty("display", "block", "important");
        player.style.setProperty("margin", "0 auto", "important");
    }

    function attach(player) {
        if (observers.has(player)) return;

        const container = player.closest(".no-overflow")
            || player.parentElement;

        if (!container) return;

        const observer = new ResizeObserver(() => resize(player, container));
        observer.observe(container);
        observers.set(player, observer);

        resize(player, container);
    }

    function scan() {
        document.querySelectorAll(selector).forEach(attach);
    }

    browser.storage.local.get("mode").then(result => {
        mode = result.mode || "auto";
        scan();
    });

    browser.storage.onChanged.addListener(changes => {
        if (changes.mode) {
            mode = changes.mode.newValue || "auto";
            for (const player of observers.keys()) {
                const container = player.closest(".no-overflow")
                    || player.parentElement;
                if (container) resize(player, container);
            }
        }
    });

    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener("resize", () => {
        for (const player of observers.keys()) {
            const container = player.closest(".no-overflow")
                || player.parentElement;
            if (container) resize(player, container);
        }
    });
})();

