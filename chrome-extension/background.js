// https://github.com/GoogleChrome/chrome-extensions-samples

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd === 'open_html') {
    fetch(request.src)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = function() {
          const imageFile = reader.result;
          console.log('Image URL ICICI:', imageFile);
          chrome.storage.local.set({image: imageFile}).then(() => {
            chrome.tabs.create({url: `https://bd-ai-boom.netlify.app/?uploadimage=true`});
          });
        }
        reader.readAsDataURL(blob);
      });
  }
});

  
// event to run execute.js content when extension's button is clicked
chrome.action.onClicked.addListener(execScript);

async function execScript() {
  const tabId = await getTabId();
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['execute.js']
  })
}

async function getTabId() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  return (tabs.length > 0) ? tabs[0].id : null;
}
