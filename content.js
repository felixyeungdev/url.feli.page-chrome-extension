let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateLocalStorage() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get("extensionHistory", function (result) {
                window.localStorage.extensionHistory =
                    result["extensionHistory"] || "[]";
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

async function removeItemsFromHistory() {
    var removalList = JSON.parse(
        window.localStorage.extensionHistoryRemoval || "[]"
    );
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get("extensionHistory", function (result) {
                var extensionHistory = JSON.parse(
                    result["extensionHistory"] || "[]"
                );
                extensionHistory = extensionHistory.filter(
                    (history) => !removalList.includes(history["shortUrl"])
                );
                chrome.storage.sync.set(
                    { extensionHistory: JSON.stringify(extensionHistory) },
                    function () {
                        resolve();
                    }
                );
            });
        } catch (error) {
            reject(error);
        }
    });
}

(async function () {
    while (true) {
        try {
            await updateLocalStorage();
            await removeItemsFromHistory();
        } catch (error) {}
        await sleep(1000);
    }
})();
