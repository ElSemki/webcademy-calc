import * as Model from './model.js';
import updateResultsView from './view/updateResultsView.js';
import programs from './view/radioPrograms.js';
import { updateMinPercents } from './view/utils.js';

import costInput from './view/costInput.js';
import costRange from './view/costRange.js';

import paymentInput from './view/paymentInput.js';
import paymentRange from './view/paymentRange.js';

import timeInput from './view/timeInput.js';
import timeRange from './view/timeRange.js';

window.addEventListener('DOMContentLoaded', () => {
  //* Для получения актуальных свежих данных (копия объекта data)
  const getData = Model.getData;

  //* Инициализация программ (ставок)
  programs(getData);

  //* Инициализация costInput
  const cleaveCost = costInput(getData);
  const sliderCost = costRange(getData);

  //* Init payment input
  const cleavePayment = paymentInput(getData);
  const sliderPayment = paymentRange(getData);

  //* Init time input
  const cleaveTime = timeInput(getData);
  const sliderTime = timeRange(getData);

  Model.setData({});
  const results = Model.getResults();
  updateResultsView(results);

  //* Слушатель пользовательского события, которое обновляет данные
  document.addEventListener('updateForm', (e) => {
    //* Обновление данных (data & results)
    Model.setData(e.detail);

    const data = Model.getData();
    const results = Model.getResults();

    //* Обновляем все что связано с внешним видом формы, основываясь на данных из модели
    updateFormAndSliders(data);

    //* Обновление results block
    updateResultsView(results);
  });

  function updateFormAndSliders(data) {
    //* Update radio btns
    if (data.onUpdate === 'radioProgram') {
      updateMinPercents(data);

      //* Update payment slider
      sliderPayment.noUiSlider.updateOptions({
        range: {
          min: data.minPaymentPercents * 100,
          max: data.maxPaymentPercents * 100,
        },
      });
    }

    //* costInput
    if (data.onUpdate !== 'inputCost') {
      cleaveCost.setRawValue(data.cost);
    }

    //* costSlider
    if (data.onUpdate !== 'costSlider') {
      sliderCost.noUiSlider.set(data.cost);
    }

    //* peymentInput
    if (data.onUpdate !== 'inputPayment')
      cleavePayment.setRawValue(data.payment);

    //* paymentSlider
    if (data.onUpdate !== 'paymentSlider') {
      sliderPayment.noUiSlider.set(data.paymentPercents * 100);
    }

    //* timeInput
    if (data.onUpdate !== 'inputTime') cleaveTime.setRawValue(data.time);

    //* timeSlider
    if (data.onUpdate !== 'timeSlider') sliderTime.noUiSlider.set(data.time);
  }

  //* Order form
  const openFormBtn = document.querySelector('#openFormBtn');
  const orderForm = document.querySelector('#orderForm');
  const submitFormBtn = document.querySelector('#submitFormBtn');

  openFormBtn.addEventListener('click', function () {
    orderForm.classList.remove('none');
    openFormBtn.classList.add('none');
  });
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    //* Собираем данные с формы перед disabled
    const formData = new FormData(orderForm);

    //* disabled для формы и кнопки
    submitFormBtn.setAttribute('disabled', true);
    submitFormBtn.innerText = 'Заявка отправляется...';

    orderForm
      .querySelectorAll('input')
      .forEach((input) => input.setAttribute('disabled', true));

    fetchData();

    async function fetchData() {
      const data = Model.getData();
      const results = Model.getResults();

      let url = checkOnUrl(document.location.href);

      function checkOnUrl(url) {
        let urlArrayDot = url.split('.');
        if (urlArrayDot.at(-1) === 'html') {
          urlArrayDot.pop();
          let newUrl = urlArrayDot.join('.');
          let urlArraySlash = newUrl.split('/');
          urlArraySlash.pop();
          newUrl = urlArraySlash.join('/') + '/';

          return newUrl;
        }
        return url;
      }

      const response = await fetch(url + 'mail.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          form: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
          },
          data,
          results,
        }),
      });

      const result = await response.text();
      console.log(result);

      submitFormBtn.removeAttribute('disabled', true);
      submitFormBtn.innerText = 'Оформить заявку';

      orderForm
        .querySelectorAll('input')
        .forEach((input) => input.removeAttribute('disabled', true));

      orderForm.reset();
      orderForm.classList.add('none');

      if (result === 'SUCCESS') {
        document.querySelector('#success').classList.remove('none');
      } else {
        document.querySelector('#error').classList.remove('none');
      }
    }
  });
});
