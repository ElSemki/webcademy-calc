import updateModal from './../utils/updateModal.js';

function init(getData) {
  const data = getData();
  const input = document.querySelector('#input-cost');

  const settings = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
  };

  //* Подключаем библиотеку на нужный инпут
  const cleaveInput = new Cleave(input, settings);

  //* Устанавливаем начальное значение при загрузке страницы
  cleaveInput.setRawValue(data.cost);

  input.addEventListener('input', function () {
    //* Получаем введенное значение в инпут
    const value = +cleaveInput.getRawValue();

    //* Проверка на мин. и макс. цену
    if (value < data.minPrice || value > data.maxPrice) {
      input.closest('.param__details').classList.add('param__details--error');
    }

    if (value >= data.minPrice && value <= data.maxPrice) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
    }

    //* Обновить модель
    updateModal(input, { cost: value, onUpdate: 'inputCost' });
  });

  //* Если ввели сумму больше или меньше чем максимальная - при выходе из инпута убирать красную рамку и менять введенное число на мин или макс
  input.addEventListener('change', function () {
    const value = +cleaveInput.getRawValue();
    if (value > data.maxPrice) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
      cleaveInput.setRawValue(data.maxPrice);
    }

    if (value < data.minPrice) {
      input
        .closest('.param__details')
        .classList.remove('param__details--error');
      cleaveInput.setRawValue(data.minPrice);
    }

    //* Обновить модель
    updateModal(input, {
      cost: +cleaveInput.getRawValue(),
      onUpdate: 'inputCost',
    });
  });

  return cleaveInput;
}

export default init;
