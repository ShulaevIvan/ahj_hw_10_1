import Popup from '../popup/popup';

export default class Timeline {
  constructor(timelineTag) {
    this.timeLineContainer = document.querySelector(timelineTag);
    this.viewPostWindow = document.querySelector('.popup-post-wrap');
    this.closePostWindow = document.querySelector('.popup-post-rm-btn');
    this.timeLineUl = this.timeLineContainer.querySelector('.timeline');
    this.keyboard = this.timeLineContainer.querySelector('.keyboard');
    this.microfoneBtn = this.timeLineContainer.querySelector('.microfone-icon');
    this.microfoneOkBtn = this.timeLineContainer.querySelector('.microfone-ok-btn');
    this.microfoneCancelBtn = this.timeLineContainer.querySelector('.microfone-cancel-btn');
    this.geolocation = undefined;
    this.soundController = undefined;
    this.soundStream = undefined;
    this.popup = new Popup('.popup-warning');
    this.iconViewEvent = this.iconViewEvent.bind(this);
    this.popupOkBtnEvent = this.popupOkBtnEvent.bind(this);
    this.validateCords = this.validateCords.bind(this);
    this.microfoneClickEvent = this.microfoneClickEvent.bind(this);
    this.microfoneCancelEvent = this.microfoneCancelEvent.bind(this);
    this.microfoneOkEvent = this.microfoneOkEvent.bind(this);
    this.hidePost = this.hidePost.bind(this);
    this.yandexStaticUrl = 'https://static-maps.yandex.ru/1.x/';

    this.microfoneBtn.addEventListener('click', this.microfoneClickEvent);
    this.microfoneBtn.setAttribute('status', 'deactivated');
    this.microfoneCancelBtn.addEventListener('click', this.microfoneCancelEvent);
    this.microfoneOkBtn.addEventListener('click',this.microfoneOkEvent);

    this.keyboard.addEventListener('click', (e) => {
      if (!this.geolocation) this.getUserGeo();
      e.target.value = '';
    });

    this.closePostWindow.addEventListener('click', this.hidePost);
    this.keyboard.addEventListener('keyup', this.validateCords);
    this.popup.okBtn.addEventListener('click', this.popupOkBtnEvent);
  }

  microfoneClickEvent = async (e) => {
    this.target = e.target;
    const micStatus = this.target.getAttribute('status');
    if (micStatus === 'deactivated') {
      this.microfoneCancelBtn.classList.add('show-mic');
      this.microfoneCancelBtn.classList.remove('hide-mic');
      this.microfoneOkBtn.classList.add('show-mic');
      this.microfoneOkBtn.classList.remove('hide-mic');
      this.microfoneBtn.classList.add('hide-mic');
      this.microfoneBtn.classList.remove('show-mic');
      this.target.setAttribute('status', 'active');
      this.soundStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.soundController = new MediaRecorder(this.soundStream);
      const chunks = [];
      this.soundController.addEventListener("start", () => {
        console.log("start");
      });
      this.soundController.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });
      this.soundController.addEventListener("stop", () => {
        const blob = new Blob(chunks);
        const audioData = URL.createObjectURL(blob);
        this.createAudioPost(audioData)
      });
      this.soundController.start();
    }
  }

  microfoneOkEvent = async (e) => {
    this.target = e.target;
    const micTag = this.target.parentNode.querySelector('.microfone-icon');
    const micStatus = micTag.getAttribute('status');
    if (micStatus === 'active') {
      this.microfoneCancelBtn.classList.remove('show-mic');
      this.microfoneCancelBtn.classList.add('hide-mic');
      this.microfoneOkBtn.classList.remove('show-mic');
      this.microfoneOkBtn.classList.add('hide-mic');
      this.microfoneBtn.classList.add('show-mic');
      micTag.setAttribute('status', 'deactivated');
      this.microfoneBtn.classList.add('show-mic');
      this.soundController.stop();
    }
  }

  microfoneCancelEvent = async (e) => {
    this.target = e.target;
    const micTag = this.target.parentNode.querySelector('.microfone-icon');
    const micStatus = micTag.getAttribute('status');
    if (micStatus === 'active') {
      this.microfoneCancelBtn.classList.remove('show-mic');
      this.microfoneCancelBtn.classList.add('hide-mic');
      this.microfoneOkBtn.classList.remove('show-mic');
      this.microfoneOkBtn.classList.add('hide-mic');
      this.microfoneBtn.classList.add('show-mic');
      micTag.setAttribute('status', 'deactivated');
      this.microfoneBtn.classList.add('show-mic');
      console.log(this.soundController)
    }
  }

  popupOkBtnEvent = (e) => {
    if (this.popup.userCords && this.popup.userCords !== undefined) {
      const date = new Date().toLocaleString('ru', { numeric: true });
      this.createPost(this.keyboard.value, date, this.popup.userCords);
      this.keyboard.value = '';
    }
  };

  iconViewEvent(e) {
    const post = e.target.closest('.post');
    const textData = post.querySelector('.post-text').textContent;
    const dateData = post.querySelector('.post-date').textContent;
    const cordsData = post.querySelector('.cords').querySelector('span').textContent;
    let longitude;
    let latitude;
    if (this.popup.userCords !== undefined) {
      longitude = this.popup.userCords.longitude;
      latitude = this.popup.userCords.latitude;
    } else {
      longitude = this.geolocation.longitude;
      latitude = this.geolocation.latitude;
    }

    this.urlIcon = `pt=${longitude},${latitude}`;
    this.imgUrl = `${this.yandexStaticUrl}?ll=${longitude},${latitude}&z=15&size=450,450&l=map&${this.urlIcon}`;
    const postData = {
      text: textData,
      date: dateData,
      cords: cordsData,
      map: this.imgUrl,
    };
    const position = e.target.getBoundingClientRect();
    this.viewPost(position, postData);
  }

  validateKeyboard(text) {
    this.text = text;
    // eslint-disable-next-line
    if (isNaN(this.text) && this.text) return true;
    return false;
  }

  validateCords(e) {
    this.key = e.key;
    if (this.key === 'Enter') {
      this.keyboard.classList.remove('inputErr');
      this.validate = this.validateKeyboard(this.keyboard.value.trim());
      if (this.validate && this.geolocation.latitude) {
        this.date = new Date().toLocaleString('ru', { numeric: true });
        this.createPost(this.keyboard.value, this.date, this.geolocation);
        this.keyboard.value = '';
      } else if (this.validate && Object.keys(this.geolocation).length === 0) {
        const position = e.target.getBoundingClientRect();
        this.popup.show(position);
      } else if (!this.validate) {
        this.keyboard.classList.add('inputErr');
      }
    }
  }

  getUserGeo() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        this.geolocation = {
          longitude: data.coords.longitude,
          latitude: data.coords.latitude,
        };
      }, this.geUserGeoErr, { enableHighAccuracy: true });
    }
    this.geolocation = {};
  }

  geUserGeoErr(err) {
    this.err = err;
  }

  viewPost(position, data = undefined) {
    if (this.viewPostWindow.classList.contains('hidePost') && data) {
      const viewPostText = this.viewPostWindow.querySelector('.popup-post-text');
      const viewPostDate = this.viewPostWindow.querySelector('.popup-post-date');
      const viewPostCords = this.viewPostWindow.querySelector('.popup-post-cords');
      const viewPostMap = this.viewPostWindow.querySelector('#map');
      viewPostText.textContent = data.text;
      viewPostDate.textContent = data.date;
      viewPostCords.textContent = data.cords;
      viewPostMap.setAttribute('src', data.map);
      this.viewPostWindow.style.top = `${position.top / 2}px`;
      this.viewPostWindow.style.left = `${position.left / 2}px`;
      this.viewPostWindow.classList.add('viewPost');
      this.viewPostWindow.classList.remove('hidePost');
    }
  }

  hidePost() {
    if (this.viewPostWindow.classList.contains('viewPost')) {
      this.viewPostWindow.classList.add('hidePost');
      this.viewPostWindow.classList.remove('viewPost');
      this.keyboard.value = '';
    }
  }

  createPost(text, date, cordObj) {
    const li = document.createElement('li');
    const post = document.createElement('div');
    const postText = document.createElement('div');
    const postDate = document.createElement('div');
    const cords = document.createElement('div');
    const cordsIcon = document.createElement('span');
    const cordinate = document.createElement('span');
    cordinate.textContent = `[${cordObj.latitude},  ${cordObj.longitude}]`;
    postText.textContent = text;
    postDate.textContent = date;
    cordsIcon.classList.add('cords-icon');
    cords.classList.add('cords');
    postDate.classList.add('post-date');
    postText.classList.add('post-text');
    post.classList.add('post');
    cordsIcon.addEventListener('click', this.iconViewEvent);
    cords.appendChild(cordinate);
    cords.appendChild(cordsIcon);
    post.appendChild(postText);
    post.appendChild(postDate);
    post.appendChild(cords);
    li.appendChild(post);
    this.timeLineUl.appendChild(li);
  }

  createAudioPost(audioData) {
    const li = document.createElement('li');
    const post = document.createElement('div');
    const audio = document.createElement('audio');
    const postDate = document.createElement('div');
    postDate.textContent = new Date().toLocaleString('ru', { numeric: true });
    postDate.classList.add('post-date');
    post.classList.add('post');
    audio.setAttribute('controls', '');
    audio.src = audioData;
    post.appendChild(postDate);
    post.appendChild(audio);
    li.appendChild(post);
    this.timeLineUl.appendChild(li);
  }

}
