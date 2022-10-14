const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

resize();

function render(){

}

function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

requestAnimationFrame(render);

document.onresize = resize;