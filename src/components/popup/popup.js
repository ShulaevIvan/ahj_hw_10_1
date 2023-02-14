

export default class Popup {
    constructor(popupTag) {
        this.popup = document.querySelector(popupTag);
        this.cancelBtn = this.popup.querySelector('.popup-warning-cancel');
        this.okBtn = this.popup.querySelector('.popup-warning-ok');
        this.popupInput = this.popup.querySelector('.popup-input');
        this.userCords = undefined;

        this.popupInput.addEventListener('click', this.clearInput);
        this.cancelBtn.addEventListener('click', this.cancelEvent);
        this.okBtn.addEventListener('click', this.okEvent)
    }

    cancelEvent = (e) => {
        this.popupInput.classList.remove('inputErr');
        this.popupInput.value = '';
        this.hide();
    }

    okEvent = (e) => {
        this.value = this.popupInput.value.trim();
        this.checkInput = this.validateInput(this.value);
        if (this.checkInput) {
            this.hide();
            this.popupInput.value = '';
            this.retObj = {
                latitude: this.cords.split(',')[0],
                longitude: this.cords.split(',')[1]
            }
            this.userCords = this.retObj
        }
        else {
            this.popupInput.classList.add('inputErr');
            this.popupInput.value = 'пример кординат 12.xx, 19.xxxxxxx';
        }
    }

    clearInput = () => {
        this.popupInput.classList.remove('inputErr');
        this.popupInput.value = '';
    }

    validateInput(text) {
        this.cords = text.replace(' ', '');
        this.pattern = /\d+\.\d+\,\d+\.\d+/;
        if (this.pattern.test(this.cords)) {
            return this.cords;
        }
        return false;
        
    }

    show() {
        if (this.popup.classList.contains('hidden')) {
            this.popup.classList.remove('hidden');
            this.popup.classList.add('show');
        }
    }
    
    hide() {
        if (this.popup.classList.contains('show')) {
            this.popup.classList.remove('hidden');
            this.popup.classList.add('hidden');
        }
    }
}