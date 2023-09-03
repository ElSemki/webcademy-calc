import updateModal from '../utils/updateModal.js';

function init(getData) {
  const input = document.querySelector('#input-downpayment');

  const settings = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
  };

  //* Подключаем библиотеку на нужный инпут
  const cleaveInput = new Cleave(input, settings);

  //* Устанавливаем начальное значение при загрузке страницы
  cleaveInput.setRawValue(getData().payment);

  input.addEventListener('input', function () {
    //* Получаем введенное значение в инпут
    const value = +cleaveInput.getRawValue();

    //* Проверка на мин. и макс. сумму первого платежа
    if (
      value < getData().getMinPayment() ||
      value > getData().getMaxPayment()
    ) {
      input.closest('.param__details').classList.add('param__details--error');
    }

    if (
      value >= getData().getMinPayment() &&
      value <= getData().getMaxPayment()
    ) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
    }

    //* Обновить модель
    updateModal(input, { payment: value, onUpdate: 'inputPayment' });
  });

  //* Если ввели сумму больше или меньше чем максимальная - при выходе из инпута убирать красную рамку и менять введенное число на мин или макс
  input.addEventListener('change', function () {
    const value = +cleaveInput.getRawValue();
    if (value > getData().getMaxPayment()) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
      cleaveInput.setRawValue(getData().getMaxPayment());
    }

    if (value < getData().getMinPayment()) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
      cleaveInput.setRawValue(getData().getMinPayment());
    }

    //* Обновить модель
    updateModal(input, {
      payment: value,
      onUpdate: 'inputPayment',
    });
  });

  return cleaveInput;
}

export default init;
