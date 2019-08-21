let button = document.getElementById('button');

button.onclick = function (element) {
    //  Sending a message to the content script in the selected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("PopUp Tabs:" + tabs.length);

        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"});
    });
};