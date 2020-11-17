chrome.runtime.onMessageExternal.addListener(function (
    request,
    sender,
    sendResponse
) {
    if (request.deleteHistory) {
        console.debug(`request.deleteHistory ${request.deleteHistory}`);
        try {
            chrome.storage.sync.get("extensionHistory", function (result) {
                var extensionHistory = JSON.parse(
                    result["extensionHistory"] || "[]"
                );
                extensionHistory = extensionHistory.filter(
                    (history) => history["shortUrl"] != request.deleteHistory
                );
                chrome.storage.sync.set(
                    { extensionHistory: JSON.stringify(extensionHistory) },
                    function (result) {
                        sendResponse(true);
                    }
                );
            });
        } catch (error) {
            sendResponse(false);
        }
    } else if (request.getHistory) {
        console.debug(`request.getHistory ${request.getHistory}`);
        try {
            chrome.storage.sync.get("extensionHistory", function (result) {
                sendResponse(JSON.parse(result["extensionHistory"] || "[]"));
            });
        } catch (error) {
            sendResponse(null);
        }
    }
});
