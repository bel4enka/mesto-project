import './index.css';


import {enableValidation} from '../components/validate.js';
import {closePopup} from '../components/modal.js';
import {deletePlace, toggleLike, openPlace} from '../components/cards.js';


const name = document.querySelector('.form__item_el_name');
const activity = document.querySelector('.form__item_el_activity');
const profileName = document.querySelector('.profile__name')
const profileActivity = document.querySelector('.profile__activity');
/**
 * Редактирование профиля
 */
export function editProfile() {
    profileName.textContent = name.value;
    profileActivity.textContent = activity.value;
}
/**
 * Обработчики событий на общий контейнер с фотографиями Мест
 */
document.querySelector('.gallery__list').addEventListener('click', function (e) {
  const target = e.target;

  if (target.classList.contains('photo__del')) {
    deletePlace(target)
  } else if (target.classList.contains('photo__heart')) {
    toggleLike(target)
  } else if (target.classList.contains('photo__img')) {
    openPlace(target)
  }
})

/**
 * Обработчик события на формы ввода
 */
export function setFormSubmitHandler(formSelector, callFunc) {
    const form = document.querySelector(formSelector);
    form.addEventListener('submit', function (e) {
        closePopup()
        callFunc(form);
    });
}
/**
 * Закрытие popup по клику на овелей
 */
document.querySelectorAll('.popup')
    .forEach((element) => element .addEventListener('click', function (e) {
        if (e.target.classList.contains('popup_opened')) {
            closePopup()
        }
        e.stopPropagation();

    }))

enableValidation({
    formSelector: '.form',
    inputSelector: '.form__item',
    submitButtonSelector: '.form__button',
    inactiveButtonClass: 'form__button_disabled',
    inputErrorClass: 'form__item_type_error',
    errorClass: 'form__item-error_active'
});
