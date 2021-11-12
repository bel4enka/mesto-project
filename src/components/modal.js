/**
 * Задаёт блок, который должен быть показан по нажатию на указанный элемент.
 */
export function setOpenPopupEventHandlers(popupSelector, openSelector, callback) {
  const popup = document.querySelector(popupSelector)
  document.querySelector(openSelector).addEventListener('click', function () {
    callback()
    openPopup(popup)})
}

/**
 * Закрытие popup по клавише Escape
 */
function closeEsc (e) {
  if (e.key === 'Escape') {
    closePopup()
  }
}
/**
 * Открывает popup
 */
export function openPopup(popup) {
  popup.classList.add('popup_opened')
  document.addEventListener('keydown', closeEsc)
}
/**
 * Закрытие карточки
 */
export function closePopup() {
  document.querySelector('.popup_opened').classList.remove('popup_opened');
  document.removeEventListener('keydown', closeEsc)
}

/**
 * Обработчик события на крестик popup
 */
export function setupPopupEventHandlers() {
  const closePopupButtons = document.querySelectorAll('.popup__close');

  closePopupButtons.forEach((element) => {
    const popup = element.closest('.popup')
    element.addEventListener('click', () => closePopup(popup))
  })
}
