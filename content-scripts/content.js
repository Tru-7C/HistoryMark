var isMarked = false;
var draw;

CreateBookmarkImage();

document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.code === 'KeyB') {
        event.preventDefault();
        
        if (isMarked)
        {
            isMarked = false;
            draw.hide();
        }
        else if (!isMarked)
        {
            isMarked = true;
            draw.show();
        }
    }
});

function CreateBookmarkImage() {
    draw = SVG().addTo('body').size(100, 100).attr({ style: 'position: fixed; top: 100; right: 50;' });
    draw.hide();
    draw.rect(100, 100).attr({ fill: '#f06' });
}

