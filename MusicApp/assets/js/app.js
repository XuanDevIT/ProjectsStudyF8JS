/*
                    1. Render songs-->ok
                    2. Scroll to top-->ok
                    3. Play, Pause, Seek--> ok
                    4. CD rotate-->ok
                    5. Next, Prev-->ok
                    6. Random-->ok
                    7. Next and Repeat when ended-->ok
                    8. Active song
                    9. Scroll active song into view
                    10. Play song when click
                    11. add volume
                    */
import { songs } from "./listSongs.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $(".song__name");
const cdThumb = $(".cd__img");
const audio = $("#audio");
const songAuthor = $(".song__author");

var isPlaying = false;
var isRandom = false;
const isRepeat = false;
const app = {
  currentIndex: 0,
  songs: songs,

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<li class="playList__item ${
        index === this.currentIndex ? "active" : ""
      }"data-index="${index}">
    <div class="playList__item-img">
      <img src="${song.image}" alt="" />
    </div>
    <div class="playList__item-info">
      <h3 class="playList__item-name">${song.nameSong}</h3>
      <p class="playList__item-author">${song.singer}</p>
    </div>
    <div class="music-waves ${index === this.currentIndex ? "active" : ""}">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <sapn class="playList__item-option">
      <i class="fa-solid fa-ellipsis"></i>
    </sapn>
  </li>`;
    });
    $(".playList__list").innerHTML = htmls.join("");
  },
  togglePlayList: function () {
    $(".playList__container").classList.toggle("list-open");
  },
  //hàm scroll
  scrollToActiveSong() {
    setTimeout(() => {
      songItemActive.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      });
    }, 300);
  },

  defineProperties() {
    const _this = this;
    Object.defineProperty(_this, "currentSong", {
      get: function () {
        return _this.songs[_this.currentIndex];
      },
    });
  },

  getCurrentSongs: function () {
    return this.songs[this.currentIndex];
  },

  handle: function () {
    const _this = this;
    $(".list-music__icon").onclick = function () {
      _this.togglePlayList();
    };

    //xử lý xoay đĩa
    const thumb = $(".cd__img").animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      { duration: 20000, iterations: Infinity }
    );
    thumb.pause();
    //xu ly khi click play;
    $(".btn__play").onclick = function () {
      if (!isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    audio.onplay = function () {
      $(".btn__play").classList.toggle("playing");
      isPlaying = true;
      thumb.play();
    };

    audio.onpause = function () {
      $(".btn__play").classList.toggle("playing");
      isPlaying = false;
      thumb.pause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        $(".progress-bar__value").style.width = progressPercent + "%";
        //set durationTime và currentTime cho bài hát
        $(".progress-time__current-time").textContent = _this.getMinutesSong();
        $(".progress-time__duration").textContent = _this.setMinutesSong();
      }
    };
    $(".btn__next").onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      //_this.render();
      _this.scrollToActiveSong();
    };

    $(".playList__close").onclick = function () {
      _this.togglePlayList();
    };

    $(".btn__previous").onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      //_this.render();
      _this.scrollToActiveSong();
    };

    $(".btn__random").onclick = function () {
      _this.isRandom = !this.isRandom;
      this.classList.toggle("active", _this.isRandom);
    };

    $(".progress-bar").onmousedown = function (e) {
      const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
      audio.currentTime = seekTime;
      _this.isHoldProgressBar = true;
    };

    $(".playList").onclick = function (e) {
      const songNode = e.target.closest(".playList__item:not(.active)");
      const songOption = e.target.closest(".playList__item-option");
      if (songNode || songOption) {
        if (songNode && !songOption) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          _this.scrollToActiveSong();
          audio.play();
        }
        if (songOption) {
          alert("You just clicked the option button");
        }
      }
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        $(".btn__next").click();
      }
    };

    $(".btn__repeat").onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      $(".btn__repeat").classList.toggle("active", _this.isRepeat);
    };
  },
  loadCurrentSong: function () {
    heading.innerHTML = this.getCurrentSongs().nameSong;
    cdThumb.src = this.getCurrentSongs().image;
    audio.src = this.getCurrentSongs().path;
    songAuthor.innerHTML = this.getCurrentSongs().singer;
    $(".progress-bar__value").style.width = 0;
  },
  // hàm lấy ra số phút của bài hát
  setMinutesSong() {
    const time = audio.duration;
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time - 60 * minutes)
      .toString()
      .padStart(2, "0");
    return minutes + ":" + seconds;
  },
  getMinutesSong() {
    const time = audio.currentTime;
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time - 60 * minutes)
      .toString()
      .padStart(2, "0");

    return minutes + ":" + seconds;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong: function () {
    this.currentIndex = Math.floor(Math.random() * this.songs.length);
    console.log(this.currentIndex);
    this.loadCurrentSong();
  },

  start: function () {
    //định nghĩa thuộc tính cho Object;
    this.getCurrentSongs();

    //Lắng nghe/ xử lý các sự kiện
    this.handle();

    //Load bài hát đầu tiên
    this.loadCurrentSong();

    //render Playlíst
    this.render();
  },
};

app.start();
