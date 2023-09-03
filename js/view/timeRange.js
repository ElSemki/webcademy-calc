import updateModal from '../utils/updateModal.js';

function init(getData) {
  const data = getData();
  const slider = document.querySelector('#slider-term');

  noUiSlider.create(slider, {
    start: data.time,
    connect: 'lower',
    tooltips: true,
    step: 1,
    range: {
      min: data.minYear,
      max: data.maxYear,
    },
    format: wNumb({
      decimals: 0,
      thousand: ' ',
      suffix: '',
    }),
  });

  slider.noUiSlider.on('slide', function () {
    //* Получаем значение из слайдера
    let sliderValue = slider.noUiSlider.get();
    sliderValue = sliderValue.split('.')[0];
    sliderValue = parseInt(String(sliderValue).replace(/ /g, ''));

    updateModal(slider, { time: sliderValue, onUpdate: 'timeSlider' });
  });

  return slider;
}

export default init;
