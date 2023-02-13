export default class Popup {
    constructor(popupTag) {
        this.popup = document.querySelector(popupTag);
        this.popup.classList.add('hidden');
    }

    show() {
        if (this.popup.classList.contains('hidden')) {
            this.popup.classList.remove('hidden');
            this.popup.classList.add('show');  
        }
    }
    
    hide() {
        if (this.popup.classList.contains('show')) {
            this.popup.classList.show('hidden');
            this.popup.classList.add('hidden');
        }
    }
}