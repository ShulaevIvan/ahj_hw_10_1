import Timeline from '../components/timeline/timeline';

window.addEventListener('DOMContentLoaded', () => {
    const timeLine = new Timeline('.timeline-container');
    timeLine.getUserGeo()
})