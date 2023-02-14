
import Popup from '../popup/popup';

export default class Timeline {
    constructor(timelineTag) {
        this.timeLineContainer = document.querySelector(timelineTag);
        this.viewPostWindow = document.querySelector('.popup-post-wrap');
        this.closePostWindow  = document.querySelector('.popup-post-rm-btn');
        this.timeLineUl = this.timeLineContainer.querySelector('.timeline');
        this.keyboard = this.timeLineContainer.querySelector('.keyboard');
        this.geolocation = undefined;
        this.popup = new Popup('.popup-warning');
        this.iconViewEvent = this.iconViewEvent.bind(this);
        this.popupOkBtnEvent = this.popupOkBtnEvent.bind(this);
        this.hidePost = this.hidePost.bind(this);
        this.yandexStaticUrl = 'https://static-maps.yandex.ru/1.x/'
        this.keyboard.addEventListener('click', (e) => {
            e.target.value = '';
        });

        this.closePostWindow.addEventListener('click', this.hidePost);

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
                else if (this.validate && Object.keys(this.geolocation).length === 0) {
                    this.popup.show();
                    return;
                }
                else if (!this.validate) {
                    this.keyboard.classList.add('inputErr');
                    return;
                }
            }
        });

        this.popup.okBtn.addEventListener('click', this.popupOkBtnEvent);
    }

    popupOkBtnEvent = (e) => {
        if (this.popup.userCords && this.popup.userCords !== undefined) {
            const date = new Date().toLocaleString('ru', { numeric:true });
            this.createPost(this.keyboard.value, date, this.popup.userCords)
        }
    }

    iconViewEvent(e) {
        const post = e.target.closest('.post');
        const text = post.querySelector('.post-text').textContent;
        const date = post.querySelector('.post-date').textContent;
        const cords = post.querySelector('.cords').querySelector('span').textContent;
        let longitude = undefined;
        let latitude = undefined;
        if (this.popup.userCords !== undefined) {
            longitude = this.popup.userCords.longitude;
            latitude = this.popup.userCords.latitude;
        }
        else {
            longitude = this.geolocation.longitude;
            latitude = this.geolocation.latitude;
        }
       
        

        this.urlIcon = `pt=${longitude},${latitude}`
        this.imgUrl = `${this.yandexStaticUrl}?ll=${longitude},${latitude}&z=15&size=450,450&l=map&${this.urlIcon}`
        const postData = {
            text: text,
            date: date,
            cords: cords,
            map: this.imgUrl
        }
        this.viewPost(postData);
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
        this.geolocation = {};
    }

    geUserGeoErr(err) {
        console.log(err)
    }

    viewPost(data=undefined) {
        if (this.viewPostWindow.classList.contains('hidePost') && data) {
            const viewPostText = this.viewPostWindow.querySelector('.popup-post-text');
            const viewPostDate = this.viewPostWindow.querySelector('.popup-post-date');
            const viewPostCords = this.viewPostWindow.querySelector('.popup-post-cords');
            const viewPostMap = this.viewPostWindow.querySelector('#map');
            viewPostText.textContent = data.text
            viewPostDate.textContent = data.date
            viewPostCords.textContent = data.cords
            viewPostMap.setAttribute('src', data.map)
            this.viewPostWindow.classList.add('viewPost');
            this.viewPostWindow.classList.remove('hidePost');
        }
        
    }

    hidePost() {
        if (this.viewPostWindow.classList.contains('viewPost')) {
            this.viewPostWindow.classList.add('hidePost');
            this.viewPostWindow.classList.remove('viewPost');
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