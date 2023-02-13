
import Popup from "../popup/popup";
export default class Timeline {
    constructor(timelineTag) {
        this.timeLineContainer = document.querySelector(timelineTag);
        this.timeLineUl = this.timeLineContainer.querySelector('.timeline');
        this.keyboard = this.timeLineContainer.querySelector('.keyboard');
        this.checkGeolocation = undefined;
        this.popup = undefined;

        this.keyboard.addEventListener('keyup', (e) => {
            this.key = e.key;
            if (this.key === 'Enter') {
                this.keyboard.classList.remove('inputErr');
                this.validate = this.validateKeyboard(this.keyboard.value.trim());
                if (this.validate &&  this.checkGeolocation.latitude) {
                    this.date = new Date().toLocaleString('ru', { numeric:true });
                    this.createPost(this.keyboard.value, this.date, this.checkGeolocation);
                    this.keyboard.value = '';
                    return;
                }
                else if (this.validate && !this.checkGeolocation) {
                    this.popup.show();
                    return;
                }
                else if (!this.validate) {
                    console.log(this.keyboard)
                    this.keyboard.classList.add('inputErr');
                    return;
                }
            }
        });
    }

    validateKeyboard(text) {
        this.text = text;
        if (isNaN(this.text) && this.text) return true;
    }

    getUserGeo() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition((data) => {
                this.checkGeolocation = {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude
                }
            }, this.geUserGeoErr, { enableHighAccuracy: true });
        }
        this.checkGeolocation = false;
    }

    geUserGeoErr(err) {
        console.log(err)
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
        postDate.classList.add('post-date')
        postText.classList.add('post-text');
        post.classList.add('post');
        cords.appendChild(cordinate);
        cords.appendChild(cordsIcon);
        post.appendChild(postText);
        post.appendChild(postDate);
        post.appendChild(cords);
        li.appendChild(post);
        this.timeLineUl.appendChild(li);
    }
}