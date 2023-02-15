import { JSDOM } from 'jsdom';
import Timeline from '../../components/timeline/timeline';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

test('validate userInput', () => {
  const timeLine = new Timeline('.timeline-container');
  const type1 = timeLine.popup.validateInput('[12.332,15.51]');
  const type2 = timeLine.popup.validateInput('   12.3,    15.52]');
  const type3 = timeLine.popup.validateInput('[12,35454, 11.512');
  const type4 = timeLine.popup.validateInput('12,3, 11.5]');
  const type5 = timeLine.popup.validateInput('12,3, 11.533]');
  const type6 = timeLine.popup.validateInput('[12.3, 11.533]');

  expect(type1).toBe('12.332,15.51');
  expect(type2).toBe('12.3,15.52');
  expect(type3).toBe(false);
  expect(type4).toBe(false);
  expect(type5).toBe(false);
  expect(type6).toBe('12.3,11.533');
});

document.body.innerHTML = `<div class="timeline-container">
                                <ul class="timeline"></ul>
                            <div class="input-wrap">
                                <textarea type="text" class="keyboard" placeholder="enter your text here"></textarea>
                            </div>
                            </div>
                            <div class="popup-warning hidden">
                                <div class="popup-warning-body">
                                    <div class="popup-warning-title">Что-то пошло не так</div>
                                        <div class="popup-warning-text">
                                            К сожалению, нам не удалось определить ваше местоположение,  
                                            пожалуйста дайте разрешение на использование геолокации, 
                                            либо введите кординаты вручную.
                                        </div>
                            <div class="popup-warning-input-wrap">
                            <div class="popup-warning-subtitle">Широта и долгота через запятую</div>
                            <div class="popup-warning-input">
                            <input type="text" class="popup-input">
                            </div>
                            <div class="popup-warning-button-block">
                                <button class="popup-warning-cancel">Отмена</button>
                                <button class="popup-warning-ok">Ок</button>
                             </div>
                            </div>
                            </div>
                            </div>
    <div class="popup-post-wrap hidePost">
        <span class="popup-post-rm-btn"></span>
        <div class="popup-post-body">
            <div class="popup-post-date">23.03.1989</div>
            <div class="popup-post-text">testset</div>
            <div class="popup-post-map"><img id="map" src="#"></div>
            <div class="popup-post-cords"></div>
        </div>
    </div>
`;
