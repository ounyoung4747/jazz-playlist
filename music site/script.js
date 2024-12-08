// JavaScript를 사용하여 음악 재생기와 관련된 HTML 요소를 선택하는 코드. 각 요소는 음악 재생기 기능을 구현하는 데 사용

const wrapper = document.querySelector(".wrapper"), // wrapper: 전체 음악 재생기의 컨테이너 요소를 선택합니다.
    musicImg = wrapper.querySelector(".img-area img"), // musicImg: 현재 재생 중인 음악의 앨범 이미지를 선택합니다
    musicName = wrapper.querySelector(".song-details .name"), // musicName: 현재 재생 중인 음악의 제목을 표시하는 요소입니다.
    musicArtist = wrapper.querySelector(".song-details .artist"), // musicArtist: 현재 재생 중인 음악의 아티스트 이름을 표시하는 요소입니다
    playPauseBtn = wrapper.querySelector(".play-pause"), // playPauseBtn: 음악 재생 및 일시 정지를 제어하는 버튼입니다.
    prevBtn = wrapper.querySelector("#prev"), // prevBtn: 이전 음악으로 이동하는 버튼입니다.
    nextBtn = wrapper.querySelector("#next"), // nextBtn: 다음 음악으로 이동하는 버튼입니다.
    mainAudio = wrapper.querySelector("#main-audio"), // mainAudio: 실제 음악 파일을 재생하는 오디오 요소입니다.
    progressBar = wrapper.querySelector(".progress-bar"), // progressBar: 음악 진행 상태를 시각적으로 표시하는 바입니다
    progressArea = wrapper.querySelector(".progress-area"), // progressArea: 진행 상태를 클릭하여 조정할 수 있는 영역입니다.
    musicList = wrapper.querySelector(".music-list"),// musicList: 재생 가능한 음악 목록을 표시하는 요소입니다.
    moreMusicBtn = wrapper.querySelector("#more-music"), // moreMusicBtn: 추가 음악 목록을 보여주는 버튼입니다.
    closemoreMusic = wrapper.querySelector("#close") // closemoreMusic: 추가 음악 목록을 닫는 버튼입니다
let volume_slider = wrapper.querySelector('.volume_slider'); // volume_slider: 음악 볼륨을 조절하는 슬라이더입니다

//show Music List onclick Music Icon
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
})

//random int (rand 함수 사용하기 위한 선언 min, max) 
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Load Function
//플레이리스트에 내장된 백그라운드 이미지 개수(8개) 만큼 노래 뒤에 랜덤 설정됨 
document.body.style.backgroundImage = "url" + "('bodybg/bg" + rand(1, 8) + ".jpg')";


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);   
isMusicPaused = true; // isMusicPaused : 음악의 일시정지 여부를 결정하는 변수 선언

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();


});

//Music List start 
function loadMusic(i) {
    musicName.innerText = allMusic[i - 1].name;
    musicArtist.innerText = allMusic[i - 1].artist;

    //musicImg dictionary src
    musicImg.src = `img/${allBg[i - 1].src}.jpg`;
    mainAudio.src = `song/${allMusic[i - 1].src}.mp3`
}

//music list
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `
    <li li-index="${i + 1}">
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
    </div>
    <span id="${allMusic[i].src}" class="audio-duration"></span>
    <audio src="song/${allMusic[i].src}.mp3" class="${allMusic[i].src}"></audio>
    </li>
    `;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    let liAudioDurationtag = ulTag.querySelector(`#${allMusic[i].arc}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);

        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }

        liAudioDurationtag.innerText = `${totalMin}:${totalSec}`;
        liAudioDurationtag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//Playing Song
function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration")
        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "재생중";
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(e) {
    let getLiIndex = e.getAttribute("li-index");
    musicIndex = getLiIndex;

    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//play and Pause Event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");

    if (isMusicPlay == true) {
        pauseMusic();
    }
    else {
        playMusic();
    }
    playingSong();
})

//play music Function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//Pause Music Function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";

    mainAudio.pause();
}

//Volume Setting Function
function setVolume() {
    mainAudio.volume = volume_slider.value / 100;

    //volume False mute 
    mainAudio.muted = false;
}


//<i> class click event mute 
function mute() {
    mainAudio.muted = true;
}
function unmute() {
    mainAudio.muted = false;
}



//Update Progress Bar as to music Curr Time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;


    let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuration = wrapper.querySelector(".max-duration");

    mainAudio.addEventListener("loadeddata", () => {
        let maindDuration = mainAudio.duration;
        let totalMin = Math.floor(maindDuration / 60);
        let totalSec = Math.floor(maindDuration % 60);

        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);

    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})


//update Music And Progress Bar Control
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();

})

//next music event
nextBtn.addEventListener("click", () => {
    nextMusic();
});


//next music Function
function nextMusic() {
    musicIndex++;
    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    }
    else {
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex)
    playMusic();
    playingSong();


    //netxt music random BACKGROUND
    document.body.style.backgroundImage = "url" + "('bodybg/bg" + rand(1, 8) + ".jpg')";

}

//Prev Event
prevBtn.addEventListener("click", () => {
    prevMusic();
})

// Prev Function
function prevMusic() {
    musicIndex--;
    if (musicIndex < 1) {
        musicIndex = allMusic.length;
    }
    else {
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//change loop shuffle and repeat icon 
const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex)
            playMusic();
            break;
        case "shuffle":
            let randerIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randerIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randerIndex);

            musicIndex = randerIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})