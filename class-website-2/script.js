const video = document.querySelector(".main-video");
const rvideo = document.querySelector(".reverse-video");
rvideo.style.opacity = "0";
video.style.opacity = "1";

const playspeed = 2;

const tabs = [0, 4, 8, 12, 17.33333, 22.66667, 27.33333];
let currentTab = 0;
video.load();
rvideo.load();

let animating = false;
let clicked = false;

video.defaultPlaybackRate = 1.0;
video.playbackRate = playspeed;
rvideo.defaultPlaybackRate = 1.0;
rvideo.playbackRate = playspeed;

document.onclick = () => {
    clicked = true;
    document.querySelector(".text").style.display = "none";
    if (!animating && currentTab < tabs.length-1) {
        next();
    }
}

document.onwheel = (e) => {
    if (e.deltaY > 0 && !animating && currentTab < tabs.length-1 && clicked) {
        next();
    } else if (e.deltaY < 0 && !animating && currentTab > 0 && clicked) {
        previous();
    }
}

function next() {
    animating = true;
    currentTab++;
    video.currentTime = tabs[currentTab - 1];
    rvideo.currentTime = tabs[tabs.length - 1] - tabs[currentTab];
    hidebutton(currentTab-1);
    video.style.opacity = "1";
    rvideo.style.opacity = "0";
    video.play().then(() => console.log('Video playback started'))
        .catch(error => console.error('Error starting video playback:', error));
    setTimeout(function () {
        video.pause();
        animating = false;
        showbutton();
    }, Math.floor((tabs[currentTab] - tabs[currentTab - 1]) * 1000 / playspeed));
}

function previous() {
    animating = true;
    currentTab--;
    rvideo.currentTime = tabs[tabs.length - 1] - tabs[currentTab + 1];
    video.currentTime = tabs[currentTab];
    hidebutton(currentTab+1);
    rvideo.style.opacity = "1";
    video.style.opacity = "0";
    rvideo.play().then(() => console.log('rVideo playback started'))
        .catch(error => console.error('Error starting rvideo playback:', error));
    setTimeout(function () {
        rvideo.pause();
        animating = false;
        showbutton();
    }, Math.floor((tabs[currentTab + 1] - tabs[currentTab]) * 1000 / playspeed));
}

function showbutton(){
    if(currentTab === 0 || currentTab > 5) return;
    const buttontoshow = document.querySelector(".buttons").children.item(currentTab-1);
    buttontoshow.style.display = "block";
}

function hidebutton(prevTab){
    if(prevTab === 0 || prevTab > 5) return;
    const buttontohide = document.querySelector(".buttons").children.item(prevTab-1);
    buttontohide.style.display = "none";
}