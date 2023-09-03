import updateModal from '../utils/updateModal.js';

function init(getData) {
  const slider = document.querySelector('#slider-downpayment');

  noUiSlider.create(slider, {
    start: getData().paymentPercents * 100,
    connect: 'lower',
    tooltips: true,
    step: 1,
    range: {
      min: getData().minPaymentPercents * 100,
      max: getData().maxPaymentPercents * 100,
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

    updateModal(slider, {
      paymentPercents: sliderValue,
      onUpdate: 'paymentSlider',
    });
  });

  return slider;
}

export default init;
