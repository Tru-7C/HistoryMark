document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.code === 'KeyB') {
        event.preventDefault();
        console.log('<Ctrl + B> pressed.');
    }
});