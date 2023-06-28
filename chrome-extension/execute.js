// this code will be executed when the extension's button is clicked

(function() {
    // console.log('execute.js executed');

    let active = true;
    toggleImageButtons();

    function toggleImageButtons() {
      let images = document.querySelectorAll('img');
      for (let img of images) {
        if ((img.clientWidth >= 250 || img.clientHeight >= 250) && active) {
          img.classList.add('image-extension');
          let button = document.createElement('button');
          button.innerText = 'Add Image';
          button.classList.add('image-extension-button');
          button.style.cssText = 'position: absolute; z-index: 10; left: 5px; top: 5px; background: hotpink; color: white; border-radius: 8px; vertical-align: middle; height: 38px; padding: 0 8px; margin: 0;';
          button.addEventListener('click', function() {
            let imgSrc = img.src;
            // console.log('Image source:', imgSrc);
            chrome.runtime.sendMessage({cmd: 'open_html', src: imgSrc});
          });
          img.parentNode.insertBefore(button, img.nextSibling);
        }
      }
    }

  })();