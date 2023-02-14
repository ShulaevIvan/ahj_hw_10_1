
import Popup from '../popup/popup';

export default class Timeline {
    constructor(timelineTag) {
        this.timeLineContainer = document.querySelector(timelineTag);
        this.timeLineUl = this.timeLineContainer.querySelector('.timeline');
        this.keyboard = this.timeLineContainer.querySelector('.keyboard');
        this.geolocation = undefined;
        this.popup = new Popup('.popup-warning');
        this.iconViewEvent = this.iconViewEvent.bind(this);
        this.yandexStaticUrl = 'https://static-maps.yandex.ru/1.x/'
        this.keyboard.addEventListener('click', (e) => {
            e.target.value = '';
        });

        this.keyboard.addEventListener('keyup', (e) => {
            this.key = e.key;
            if (this.key === 'Enter') {
                this.keyboard.classList.remove('inputErr');
                this.validate = this.validateKeyboard(this.keyboard.value.trim());
                if (this.validate &&  this.geolocation.latitude) {
                    this.date = new Date().toLocaleString('ru', { numeric:true });
                    this.createPost(this.keyboard.value, this.date, this.geolocation);
                    this.keyboard.value = '';
                    return;
                }
                else if (this.validate && !this.geolocation) {
                    this.popup.show();
                    return;
                }
                else if (!this.validate) {
                    this.keyboard.classList.add('inputErr');
                    return;
                }
            }
        });

        this.popup.okBtn.addEventListener('click', (e) => {
            if (this.popup.userCords && this.popup.userCords !== undefined) {
                this.createPost(this.keyboard.value, this.date, this.popup.userCords)
            }
        });
    }

    iconViewEvent(e) {
        this.urlIcon = `pt=${this.geolocation.longitude},${this.geolocation.latitude}`
        this.imgUrl = `${this.yandexStaticUrl}?ll=${this.geolocation.longitude},${this.geolocation.latitude}&z=15&size=450,450&l=map&${this.urlIcon}`
        console.log(this.imgUrl)
    }

    getMap() {
       
    }


    validateKeyboard(text) {
        this.text = text;
        if (isNaN(this.text) && this.text) return true;
    }

    getUserGeo() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition((data) => {
                this.geolocation = {
                    longitude: data.coords.longitude,
                    latitude: data.coords.latitude,
                }
            }, this.geUserGeoErr, { enableHighAccuracy: true });
        }
        this.geolocation = false;
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
        cordsIcon.addEventListener('click', this.iconViewEvent);
        cords.appendChild(cordinate);
        cords.appendChild(cordsIcon);
        post.appendChild(postText);
        post.appendChild(postDate);
        post.appendChild(cords);
        li.appendChild(post);
        this.timeLineUl.appendChild(li);
    }
}