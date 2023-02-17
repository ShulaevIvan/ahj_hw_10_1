export default class Popup {
  constructor(popupTag) {
    this.popup = document.querySelector(popupTag);
    this.cancelBtn = this.popup.querySelector('.popup-warning-cancel');
    this.okBtn = this.popup.querySelector('.popup-warning-ok');
    this.popupInput = this.popup.querySelector('.popup-input');
    this.userCords = undefined;
    this.popupInput.addEventListener('click', this.clearInput);
    this.cancelBtn.addEventListener('click', this.cancelEvent);
    this.okBtn.addEventListener('click', this.okEvent);
  }

  cancelEvent = (e) => {
    this.popupInput.classList.remove('inputErr');
    this.popupInput.value = '';
    this.hide();
  };

  okEvent = (e) => {
    this.value = this.popupInput.value.trim();
    this.checkInput = this.validateInput(this.value);
    if (this.checkInput) {
      this.hide();
      this.retObj = {
        latitude: this.checkInput.split(',')[0],
        longitude: this.checkInput.split(',')[1],
      };
      this.userCords = this.retObj;
    } else {
      const audio = this.popup.getAttribute('audio');
      if (audio === 'false') this.popupInput.value = '';
      this.popupInput.classList.add('inputErr');
      this.popupInput.value = 'пример кординат 12.xx, 19.xxxxxxx';
    }
  };

  clearInput = () => {
    this.popupInput.classList.remove('inputErr');
    this.popupInput.value = '';
  };

  validateInput(text) {
    const clearStr = [];
    Array.from(text.trim()).forEach((i) => {
      // eslint-disable-next-line
      if (i !== ' ' || i !== '' || typeof(i) !== 'number') clearStr.push(i);
    });
    this.cords = clearStr.join('').replace('[', '').replace(']', '');
    // eslint-disable-next-line
    this.pattern = /\d+\.\d+\,(\s|\d)\d+\.\d+/;
    if (this.pattern.test(this.cords)) {
      return this.cords;
    }
    this.userCords = undefined;
    return false;
  }

  show(position) {
    if (this.popup.classList.contains('hidden')) {
      this.popup.style.top = `${position.y / 2}px`;
      this.popup.style.left = `${position.x / 2}px`;
      this.popup.classList.remove('hidden');
      this.popup.classList.add('show');
    }
  }

  hide() {
    if (this.popup.classList.contains('show')) {
      this.popupInput.value = '';
      this.popup.classList.remove('hidden');
      this.popup.classList.add('hidden');
    }
  }
}
