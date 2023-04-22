// Initialize button with users' preferred color
const changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

const getImagesBtn = document.getElementById("getImages");
getImagesBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getImages,
  });
});

function getImages() {
  const images = document.getElementsByTagName("img");
  const imageArray = [];
  for (let i = 0; i < images.length; i++) {
    imageArray.push(images[i].src);

    // Vérifie si l'image a une taille de 512 pixels ou plus
    if (images[i].naturalWidth >= 512 || images[i].naturalHeight >= 512) {
      console.log("Image trouvée : " + images[i].src);

      // Crée un bouton pour chaque image
      var button = document.createElement("button");
      button.innerText = "Envoyer sur le serveur";
      button.className = "button-class";
      button.style.position = "absolute";
      button.style.top = ".5rem";
      button.style.left = ".5rem";
      button.style.background = "hotpink";
      button.style.color = "white";
      button.style.borderRadius = ".5rem";
      button.style.padding = ".5rem";
      button.addEventListener("click", function () {
        // Ouvre un nouvel onglet pour la page de prévisualisation
        chrome.tabs.create(
          { url: chrome.runtime.getURL("preview.html") },
          function (tab) {
            // Attache un message contenant l'URL de l'image au nouvel onglet
            chrome.tabs.sendMessage(tab.id, { imageURL: images[i].src });
          }
        );

        // Crée un nouvel onglet pour la page de prévisualisation
        // chrome.tabs.create(
        //   { url: chrome.runtime.getURL("preview.html") },
        //   function (tab) {
        //     // Attache un message contenant l'URL de l'image au nouvel onglet
        //     chrome.tabs.sendMessage(tab.id, { imageURL: images[i].src });
        //   }
        // );
      });

      // Ajoute le bouton à l'élément parent de l'image
      var imageParent = images[i].parentNode;
      imageParent.insertBefore(button, images[i]);
    }
  }
  console.log(imageArray);
}
