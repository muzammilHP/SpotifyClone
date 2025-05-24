async function getSongs(folder) {
    let response = await fetch(`/${folder}/songs.json`);
    let data = await response.json();
    let songs = data.songs.map(song => `/${folder}/${song}`);
    console.log(songs);  // Check if songs are correctly loaded
    return songs;
}
async function main(){
async function loadSongs(folder) {
    let currentSong = 0;
    let songs = await getSongs(folder);
    let audio = new Audio();
    let isPlaying = false;
    let isDragging = false;
    let isMuted = false;
    let previousVolume = 1;

    let songUL = document.querySelector(".song-list").getElementsByTagName("ol")[0];
    songUL.innerHTML = "";
    let playButton = document.getElementById("play");
    let nextButton = document.getElementById("next");
    let prevButton = document.getElementById("previous");
    let seekbar = document.querySelector(".seekbar");
    let circle = document.querySelector(".circle");
    let songinfo = document.querySelector(".songinfo");  
    let songtime = document.querySelector(".songtime"); 
    let volumeControl = document.getElementById("volumeadjust");

    let hamburger = document.querySelector(".hamburger");
    let cross = document.querySelector(".cross");

    function toggleMute() {
        if (isMuted) {
            audio.volume = previousVolume; // Restore volume
            volumeControl.src = "Img/volume.svg"; // Change icon to mute
        } else {
            previousVolume = audio.volume;
            audio.volume = 0; // Mute the audio
            volumeControl.src = "Img/mute.svg"; // Change icon to unmute
        }
        isMuted = !isMuted;
    }

    volumeControl.addEventListener("click", toggleMute);

    volumeControl.addEventListener("input", (e) => {
        if (isMuted) {
            toggleMute(); // Unmute if the user changes the volume
        }
        audio.volume = e.target.value / 100;
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateSeekbar() {
        if (!isDragging) {
            const progress = (audio.currentTime / audio.duration) * 100;
            circle.style.left = `${progress}%`;
        }   
        songtime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }

    function moveCircle(e) {
        const seekbarRect = seekbar.getBoundingClientRect();
        let offsetX = e.clientX - seekbarRect.left;
        offsetX = Math.max(0, Math.min(offsetX, seekbarRect.width)); // Ensure the circle stays within bounds
        const newTime = (offsetX / seekbarRect.width) * audio.duration;
        circle.style.left = `${(offsetX / seekbarRect.width) * 100}%`;
        audio.currentTime = newTime;
    }

    function playSong(index) {
        currentSong = index;
        audio.src = songs[currentSong];
        audio.play();
        playButton.src = "Img/pause.svg";
        isPlaying = true;
        songinfo.textContent = decodeURIComponent(songs[currentSong].substring(songs[currentSong].lastIndexOf('/') + 1));
    }

    playButton.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            playButton.src = "Img/play.svg";
            isPlaying = false;
        } else {
            audio.play();
            playButton.src = "Img/pause.svg";
            isPlaying = true;
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentSong < songs.length - 1) {
            currentSong++;
        } else {
            currentSong = 0;
        }
        playSong(currentSong);
    });

    prevButton.addEventListener("click", () => {
        if (currentSong > 0) {
            currentSong--;
        } else {
            currentSong = songs.length - 1;
        }
        playSong(currentSong);
    });

    audio.addEventListener("timeupdate", updateSeekbar);

    circle.addEventListener("mousedown", () => {
        isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            moveCircle(e);
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    songs.forEach((song, index) => {
        let songName = decodeURIComponent(song.substring(song.lastIndexOf('/') + 1));
        let li = document.createElement("li");
        li.textContent = songName;
        li.addEventListener("click", () => {
            playSong(index);
        });

        songUL.appendChild(li);
    });

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100;
    });

    hamburger.addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    cross.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%";
    });
}

document.querySelectorAll(".box").forEach(box => {
    box.addEventListener("click", () => {
        let folder = box.getAttribute("data-folder");
        loadSongs(folder);
    });
});

loadSongs("Songs");
}
main();
