function closeDialog(event) {
    const dialog = document.getElementById('{id}');
    if (dialog) {
      dialog.close();
    }
  }

  function openDialog(event) {
    alert('openDialog')
    const dialog = document.getElementById('{id}');
    if (dialog) {
      dialog.showModal();
    }
  }