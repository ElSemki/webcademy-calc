//* Объект со всей информацией из калькулятора (ставки, размер ставки в %, min & max цене и тд)
let data = {
  //* Ставка по умолчанию
  selectedProgram: 0.1,
  //* Стартовая стоимость
  cost: 12000000,
  minPrice: 375000,
  maxPrice: 100000000,
  minPaymentPercents: 0.15,
  maxPaymentPercents: 0.9,
  paymentPercents: 0.5,
  payment: 6000000,
  getMinPayment() {
    return this.cost * this.minPaymentPercents;
  },
  getMaxPayment() {
    return this.cost * this.maxPaymentPercents;
  },
  minYear: 1,
  maxYear: 30,
  time: 10,
  //* Ставки
  programs: {
    base: 0.1,
    it: 0.047,
    gov: 0.067,
    zero: 0.12,
  },
};

//* Объект с результатами расчета
let results = {
  rate: data.selectedProgram,
};

//* Метод, с помощью которого мы будем возвращать копию data
function getData() {
  return { ...data };
}

//* Метод, с помощью которого мы будем возвращать копию results
function getResults() {
  return { ...results };
}

//* Метод для обновления объекта data и results (новый данные от взаимодействия с radioBtn (выбор программы (ставка)))
function setData(newData) {
  if (newData.onUpdate === 'radioProgram') {
    if (newData.id === 'zero-value') {
      data.minPaymentPercents = 0;
    } else {
      data.minPaymentPercents = 0.15;
    }
  }

  if (newData.onUpdate === 'inputCost' || newData.onUpdate === 'costSlider') {
    //* Обновление цены
    //* Если стоимость меньше мин. цены
    if (newData.cost < data.minPrice) newData.cost = data.minPrice;

    //* Если стоимость больше макс. цены
    if (newData.cost > data.maxPrice) newData.cost = data.maxPrice;

    //* Если новая стоимость меньше первоначальной
    if (data.payment > data.getMaxPayment())
      data.payment = data.getMaxPayment();

    //* Если сумма первоначальной стоимости меньше чем допустимый минимальный платеж
    if (data.payment < data.getMinPayment())
      data.payment = data.getMinPayment();

    data.paymentPercents = (data.payment * 100) / newData.cost / 100;
  }

  if (newData.onUpdate === 'inputPayment') {
    //* Пересчитываем %
    newData.paymentPercents = (newData.payment * 100) / data.cost / 100;

    //* Если % больше 90%
    if (newData.paymentPercents > data.maxPaymentPercents) {
      newData.paymentPercents = data.maxPaymentPercents;
      newData.payment = data.cost * data.maxPaymentPercents;
    }

    //* Если % меньше минимальных
    if (newData.paymentPercents < data.minPaymentPercents) {
      newData.paymentPercents = data.minPaymentPercents;
      newData.payment = data.cost * data.minPaymentPercents;
    }
  }

  if (newData.onUpdate === 'paymentSlider') {
    newData.paymentPercents = newData.paymentPercents / 100;
    data.payment = data.cost * newData.paymentPercents;
  }

  if (newData.onUpdate === 'inputTime') {
    if (newData.time > data.maxYear) newData.time = data.maxYear;
    if (newData.time < data.minYear) newData.time = data.minYear;
  }

  data = {
    ...data,
    ...newData,
  };

  //* Расчет ипотеки
  const months = data.time * 12;
  const totalAmount = data.cost - data.payment;
  const monthRate = data.selectedProgram / 12;
  const generalRate = (1 + monthRate) ** months;
  const monthPayment =
    (totalAmount * monthRate * generalRate) / (generalRate - 1);
  const overPayment = monthPayment * months - totalAmount;

  results = {
    rate: data.selectedProgram,
    totalAmount,
    monthPayment,
    overPayment,
  };
}

export { getData, getResults, setData };