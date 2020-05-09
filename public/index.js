function setup() {
    window.ondragover = function (e) {
        e.preventDefault();
        return false;
    }
    window.ondrop = function (e) {
        e.preventDefault();
        const img = new Image();
        img.src = (window.webkitURL ? webkitURL : URL).createObjectURL(e.dataTransfer.files[0]);
        const canvas = document.querySelector("#canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height); // stretch img to canvas size
        }
    }
}

window.addEventListener(`load`, function () {
    console.log("HELLO");
    setup();
});
