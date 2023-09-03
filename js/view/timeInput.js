import updateModal from '../utils/updateModal.js';

function init(getData) {
  const data = getData();
  const input = document.querySelector('#input-term');

  const settings = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
  };

  //* Подключаем библиотеку на нужный инпут
  const cleaveInput = new Cleave(input, settings);

  //* Устанавливаем начальное значение при загрузке страницы
  cleaveInput.setRawValue(data.time);

  input.addEventListener('input', function () {
    //* Получаем введенное значение в инпут
    const value = +cleaveInput.getRawValue();

    //* Проверка на мин. и макс. цену
    if (value < data.minYear || value > data.maxYear) {
      input.closest('.param__details').classList.add('param__details--error');
    }

    if (value >= data.minYear && value <= data.maxYear) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
    }

    //* Обновить модель
    updateModal(input, { time: value, onUpdate: 'inputTime' });
  });

  //* Если ввели сумму больше или меньше чем максимальная - при выходе из инпута убирать красную рамку и менять введенное число на мин или макс
  input.addEventListener('change', function () {
    const value = +cleaveInput.getRawValue();
    if (value > data.maxYear) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
      cleaveInput.setRawValue(data.maxYear);
    }

    if (value < data.minYear) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
      cleaveInput.setRawValue(data.minYear);
    }

    //* Обновить модель
    updateModal(input, {
      time: +cleaveInput.getRawValue(),
      onUpdate: 'inputTime',
    });
  });

  return cleaveInput;
}

export default init;
