function init() {
    window.ondragover = event => event.preventDefault();
    const image = new Image();
    const canvas = document.querySelector("#canvas");
    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    const ctx = canvas.getContext("2d");
    window.ondrop = async event => {
        event.preventDefault();
        image.src = (window.webkitURL ? webkitURL : URL).createObjectURL(event.dataTransfer.files[0]);
        await new Promise(resolve => image.onload = resolve);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    };
    canvas.onclick = event => {
        var x = (event.offsetX * (canvas.width / canvas.scrollWidth) + 0.5) | 0;
        var y = (event.offsetY * (canvas.height / canvas.scrollHeight) + 0.5) | 0;
        console.log(x, y);
    };
}

window.onload = () => {
    init();
};
