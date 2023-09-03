//* Генерация пользовательского события
function updateModal(element, data) {
  element.dispatchEvent(
    new CustomEvent('updateForm', {
      bubbles: true,
      detail: { ...data },
    })
  );
}

export default updateModal;
