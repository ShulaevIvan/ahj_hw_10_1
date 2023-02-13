import Popup from '../components/popup/popup';
import Timeline from '../components/timeline/timeline';

window.addEventListener('DOMContentLoaded', () => {
    const timeLine = new Timeline('.timeline-container');
    timeLine.popup = new Popup('.popup-warning');
    timeLine.getUserGeo()
})