function init(canvas, image) {
    canvas.setWidth(document.body.offsetWidth);
    canvas.setHeight(document.querySelector(".canvas-container").offsetHeight);
    window.ondragover = event => event.preventDefault();
    window.onresize = () => {
        canvas.setWidth(document.body.offsetWidth);
        canvas.setHeight(document.querySelector(".canvas-container").offsetHeight);
        canvas.setBackgroundImage(new fabric.Image(image), canvas.renderAll.bind(canvas), { scaleX: canvas.width / image.width, scaleY: canvas.height / image.height });
    }
    window.ondrop = async event => {
        event.preventDefault();
        image.src = (window.webkitURL ? webkitURL : URL).createObjectURL(event.dataTransfer.files[0]);
        await new Promise(resolve => image.onload = resolve);
        canvas.setBackgroundImage(new fabric.Image(image), canvas.renderAll.bind(canvas), { scaleX: canvas.width / image.width, scaleY: canvas.height / image.height });
    };
}
var selection;
function handleSelection(canvas) {
    var isDown, origX, origY;
    canvas.on('mouse:down', event => {
        isDown = true;
        var pointer = canvas.getPointer(event.e);
        origX = pointer.x;
        origY = pointer.y;
        var pointer = canvas.getPointer(event.e);
        if (selection != null) {
            canvas.remove(selection);
            selection = null;
        }
        selection = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - origX,
            height: pointer.y - origY,
            angle: 0,
            fill: 'rgba(255,0,0,0.1)',
            transparentCorners: false,
            hasRotatingPoint: false,
            cornerSize: 5
        });
        canvas.add(selection);
    });
    canvas.on('mouse:move', event => {
        if (!isDown) return;
        var pointer = canvas.getPointer(event.e);
        if (origX > pointer.x) {
            selection.set({ left: Math.abs(pointer.x) });
        }
        if (origY > pointer.y) {
            selection.set({ top: Math.abs(pointer.y) });
        }
        selection.set({ width: Math.abs(origX - pointer.x) });
        selection.set({ height: Math.abs(origY - pointer.y) });
        canvas.renderAll();
    });
    canvas.on('mouse:up', () => {
        isDown = false;
    });
}

window.onload = () => {
    const canvas = new fabric.Canvas("canvas", { backgroundColor: null });
    const image = new Image();
    init(canvas, image);
    handleSelection(canvas);
};
