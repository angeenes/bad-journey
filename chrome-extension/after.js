// this code will be executed after page load
(function() {
    // console.log('after.js executed');
    if (location.href.includes('uploadimage=true')) {
      chrome.storage.local.get('image').then(function(data) {
        // console.log('Image URL is set to ' + data.image);
        const modalUpload = document.getElementById('uploadImage')
        modalUpload.showModal();
        const inputUpload = document.getElementById('imagePreview');
        inputUpload.src = data.image;
        
      });
    }
  })();