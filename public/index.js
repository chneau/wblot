function init(canvas, image) {
    canvas.setWidth(innerWidth);
    canvas.setHeight(innerHeight - document.querySelector("#content").offsetHeight);
    window.ondragover = event => event.preventDefault();
    window.onresize = () => {
        canvas.setWidth(innerWidth);
        canvas.setHeight(innerHeight - document.querySelector("#content").offsetHeight);
        canvas.setBackgroundImage(new fabric.Image(image), canvas.renderAll.bind(canvas), { scaleX: canvas.width / image.width, scaleY: canvas.height / image.height });
    }
    window.ondrop = async event => {
        event.preventDefault();
        image.src = (window.webkitURL ? webkitURL : URL).createObjectURL(event.dataTransfer.files[0]);
        await new Promise(resolve => image.onload = resolve);
        canvas.setBackgroundImage(new fabric.Image(image), canvas.renderAll.bind(canvas), { scaleX: canvas.width / image.width, scaleY: canvas.height / image.height });
    };
}

function onSelectionChange(canvas, callback) {
    var selection, isDown, origX, origY;
    canvas.on('mouse:down', event => {
        if (!event.e.ctrlKey) return;
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
        if (!event.e.ctrlKey) return;
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
    canvas.on('mouse:up', event => {
        if (!event.e.ctrlKey) return;
        isDown = false;
        callback(selection);
    });
}

function getDataUrl(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}

window.onload = () => {
    const canvas = new fabric.Canvas("canvas", { backgroundColor: null });
    const image = new Image();
    init(canvas, image);
    onSelectionChange(canvas, async selection => {
        const ratioWidth = canvas.width / image.width;
        const ratioHeight = canvas.height / image.height;
        const width = (selection.width / ratioWidth + 0.5) | 0;
        const height = (selection.height / ratioHeight + 0.5) | 0;
        const x = (selection.aCoords.tl.x / ratioWidth + 0.5) | 0;
        const y = (selection.aCoords.tl.y / ratioHeight + 0.5) | 0;
        const body = { width, height, x, y, image: getDataUrl(image) };
        const response = await (await fetch("/image", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json();
        console.log(response.result);
    });
};
