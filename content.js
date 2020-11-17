chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request["new_history_item"]) {
        window.postMessage(
            {
                type: "url.feli.page-chrome-extension",
                text: "new_history_item",
            },
            "*"
        );
    }
});
