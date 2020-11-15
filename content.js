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

(async function () {
    while (true) {
        await updateLocalStorage();
        await sleep(5000);
    }
})();
