import updateModal from './../utils/updateModal.js';

//* Инициализация ставок
function init(getData) {
  const radioBtns = document.querySelectorAll('input[name="program"]');
  const { base, it, gov, zero } = getData().programs;

  //* Установим данный значения в радиокнопки
  document.querySelector('#base-value').value = base;
  document.querySelector('#it-value').value = it;
  document.querySelector('#gov-value').value = gov;
  document.querySelector('#zero-value').value = zero;

  //* Установим данный значения для пользователя
  document.querySelector('#base-text').innerText = base * 100 + '%';
  document.querySelector('#it-text').innerText = it * 100 + '%';
  document.querySelector('#gov-text').innerText = gov * 100 + '%';
  document.querySelector('#zero-text').innerText = zero * 100 + '%';

  radioBtns.forEach(function (radioBtn) {
    radioBtn.addEventListener('change', function () {
      updateModal(this, {
        onUpdate: 'radioProgram',
        selectedProgram: parseFloat(this.value),
        id: this.id,
      });
    });
  });
}

export default init;
