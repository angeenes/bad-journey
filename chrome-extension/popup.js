console.log('Script loaded');
document.getElementById('toggleButton').addEventListener('click', function() {
    console.log('popup js');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: functionToExecuteInTab
        });
    });
});

function functionToExecuteInTab() {
    // This function will be executed in the tab
    // You can put your code here
    // For example, you can send a message like this:
    chrome.runtime.sendMessage({cmd: "toggle_active"});
}