const canvas = document.createElement("canvas");
canvas.classList.add("maincanvas");
const backgroundcanvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const bgctx = backgroundcanvas.getContext("2d");
const solid = ['#', 'b'];
const links = ['w', 'x', 'y', 'z'];

const tiles = [
    ".............................................",
    ".............................................",
    "......................................zzz....",
    "......................................zzz....",
    "......................................zzz....",
    ".............................................",
    ".............................................",
    ".............................................",
    "...................................bbb.......",
    ".............................................",
    ".............................................",
    "..........................................bbb",
    ".....www.......xxx.......yyy.................",
    ".....www.......xxx.......yyy.................",
    ".....www.......xxx.......yyy.......bbb.......",
    ".............................................",
    ".............................................",
    "..........................................bbb",
    ".............................................",
    ".............................................",
    "#############################################"
]
resize();
const tws = tiles[0].length;
const ths = tiles.length;
let tw = innerWidth / tws, th = innerHeight / ths; 

const speed = 15;
let dkd = false, akd = false, wkd = false;
let inair = false;
let prevt = 0;
let px = 100, py = 100, pw = tw * 1.5, ph = th * 1.5;
let pvx = 0, pvy = 0;
let player = new Image();
player.src = "./Object.png";
player.width = pw;
player.height = ph;

ctx.fillStyle = "rgb(100, 100, 100)";
function renderbackground(){
    bgctx.fillStyle = "rgb(100, 150, 255)";
    bgctx.fillRect(0, 0, backgroundcanvas.width, backgroundcanvas.height);
    for(let i = 0; i < ths; i++){
        for(let j = 0; j < tws; j++){
            if(tiles[i][j] === '#'){
                bgctx.fillStyle = "rgb(100, 255, 100)";
                bgctx.fillRect(Math.floor(j*tw), Math.floor(i*th), Math.floor((j+1)*tw) - Math.floor(j*tw), Math.floor((i+1)*th) - Math.floor(i*th));
            }
            if(tiles[i][j] === 'b'){
                bgctx.fillStyle = "rgb(100, 100, 0)";
                bgctx.fillRect(Math.floor(j*tw), Math.floor(i*th), Math.floor((j+1)*tw) - Math.floor(j*tw), Math.floor((i+1)*th) - Math.floor(i*th));
            }
            if(links.includes(tiles[i][j])){
                bgctx.fillStyle = "rgb(150, 150, 150)";
                bgctx.fillRect(Math.floor(j*tw), Math.floor(i*th), Math.floor((j+1)*tw) - Math.floor(j*tw), Math.floor((i+1)*th) - Math.floor(i*th));
            }
        }
    }
}
renderbackground();
const bgimg = new Image();
bgimg.src = backgroundcanvas.toDataURL();
bgimg.classList.add("bgimg");
document.body.appendChild(bgimg);


function update(time){
    let dt = time - prevt;
    prevt = time;
    const rate = speed*dt/1000;
    ctx.clearRect(px, py, pw, ph);
    
    px+=Math.round(pvx*rate);
    py+=Math.round(pvy*rate);
    let tempvy = pvy;
    pvy+=2;
    if(px<0){
        px=0;
        pvx=0;
    }
    if(py<0){
        py=0;
        pvy=0;
    }
    if(px + pw>=innerWidth){
        px=innerWidth - pw - 1;
        pvx=0;
    }
    if(py + ph >= innerHeight){
        py = innerHeight - ph - 1;
        pvy = 0;
    }
    let tpositions = [
        gettile(px, py),
        gettile(px, py+th),
        gettile(px, py+ph),
        gettile(px+tw, py),
        gettile(px+tw, py+th),
        gettile(px+tw, py+ph),
        gettile(px+pw, py),
        gettile(px+pw, py+th),
        gettile(px+pw, py+ph)
    ];
    tpositions.forEach(e => {
        if(solid.includes(tiles[e[5]][e[4]]))
            [px, py, pvx, pvy] = collision(px, py, pw, ph, e[0], e[1], e[2], e[3], pvx, pvy);
    });

    if(pvy===0&&tempvy>=0)inair = false;
    else inair=true;

    if(wkd&&!inair){
        pvy=-50;
        inair = true;
    }
    if(dkd)pvx=15;else if(akd) pvx=-15; else pvx=0;
    ctx.drawImage(player, px, py, pw, ph);
    requestAnimationFrame(update);
}

function gettile(x, y){
    let tilex = Math.floor(x/tw)*tw;
    let tiley = Math.floor(y/th)*th;
    let tilew = Math.floor(x/tw+1)*tw-tilex;
    let tileh = Math.floor(y/th+1)*th-tiley;
    
    return [tilex, tiley, tilew, tileh, Math.floor(x/tw), Math.floor(y/th)];
}

function collision(x, y, w, h, tx, ty, tw, th, vx, vy){
    if(x+w>tx&&x<tx+tw&&y+h>ty&&y<ty+th){
        let dr = (x+w)-tx;
        let dl = (tx+tw)-x;
        let dd = (y+h)-ty;
        let du = (ty+th)-y;
        if(vx>=0&&vy>=0){
            if(dr>dd){
                vy=0; y-=dd;
            }else{
                vx=0; x-=dr;
            }
        }
        else if(vx>=0&&vy<=0){
            if(dr>du){
                vy=0; y+=du;
            }else{
                vx=0; x-=dr;
            }
        }
        else if(vx<=0&&vy>=0){
            if(dl>dd){
                vy=0; y-=dd;
            }else{
                vx=0; x+=dl;
            }
        }
        else if(vx<=0&&vy<=0){
            if(dl>du){
                vy=0; y+=du;
            }else{
                vx=0; x+=dl;
            }
        }
        
    }
    return [x, y, vx, vy];
}

function pointinrect(x, y, tx, ty, tw, th){
    return x > tx && y > ty && x < tx+tw && y < ty+th;
}

function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    backgroundcanvas.width = innerWidth;
    backgroundcanvas.height = innerHeight;
}

requestAnimationFrame(update);
document.onkeydown = e => {
    if((e.key === ' ' || e.key === 'w')&&!wkd){
        wkd=true;
    }
    else if((e.key === 'd' || e.key === 'ArrowRight')&&!dkd){
        dkd=true;
    }
    else if((e.key === 'a' || e.key === 'ArrowLeft')&&!akd){
        akd=true;
    }
};
document.onkeyup = e => {
    if(e.key === ' ' || e.key === 'w'){
        wkd = false;
    }
    if(e.key === 'd' || e.key === 'ArrowRight'){
        dkd = false;
    }
    else if(e.key === 'a' || e.key === 'ArrowLeft'){
        akd = false;
    }
};
document.onresize = resize;