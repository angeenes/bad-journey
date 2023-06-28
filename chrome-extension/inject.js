console.log('inject.js executed');

chrome.storage.local.get('imageUrlOriginal', function(data) {
    document.body.innerHTML = '<img src="' + imageUrlOriginal + '">';
});
// chrome.storage.local.set({ key: value }).then(() => {
//     console.log("Value is set");
//   });
  
//   chrome.storage.local.get(["key"]).then((result) => {
//     console.log("Value currently is " + result.key);
//   });