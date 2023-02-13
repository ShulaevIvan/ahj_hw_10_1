import Popup from '../components/popup/popup';
import Timeline from '../components/timeline/timeline';

window.addEventListener('DOMContentLoaded', () => {
    const popup = new Popup('.popup-warning');
    const timeLine = new Timeline('.timeline-container');
    timeLine.createPost('test', '13.02.2022', '[123 123 -12322 123] ')
})