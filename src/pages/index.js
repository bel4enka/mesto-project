import './index.css';

import {enableValidation} from '../components/validate.js';
import {closePopup, openPopup} from '../components/modal.js';
import {deletePlace, toggleLike, openPlace, renderLoading} from '../components/cards.js';
import {putUserData, putImgAvatar, putLike} from "../components/api";


const name = document.querySelector('.form__item_el_name');
const activity = document.querySelector('.form__item_el_activity');
const profileName = document.querySelector('.profile__name')
const profileActivity = document.querySelector('.profile__activity');
const profileAvatar = document.querySelector('.profile__avatar');
const formDelCard = document.querySelector('.form-confirm');
const avatarLink = document.querySelector('#link-avatar-input')
/**
 * Редактирование профиля
 */
export function editProfile() {

  const
    profileData = {
    name: name.value,
    about: activity.value,
  }

  renderLoading(true)

  putUserData(profileData)
    .then((res) => {
      profileName.textContent = name.value;
      profileActivity.textContent = activity.value;
      closePopup()
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      renderLoading(false)
    });
}

/**
 * Редактирование аватара
 */
export function editAvatar() {

  const avatarImg = {
    avatar: avatarLink.value
  }
  putImgAvatar(avatarImg)
    .then((res) => {
      profileAvatar.src = avatarLink.value;
      closePopup()
    })
    .catch((e) => {
      console.log(e)
    })
}
/**
 * Для события на общий контейнер с фотографиями Мест
 */
export function placeContainerEventHandlers(e) {
  const target = e.target;

  if (target.classList.contains('photo__del')) {
    const popup = document.querySelector('.popup_type_confirm')
    openPopup(popup)
    const idCard = target.closest('.gallery__item').getAttribute('data-id');
    popup.querySelector('.form-confirm').setAttribute('data-id', idCard)
  } else if (target.classList.contains('photo__heart')) {
    toggleLike(target)
  } else if (target.classList.contains('photo__img')) {
    openPlace(target)
  }
}

/**
 * Обработчик события на формы ввода
 */
export function setFormSubmitHandler(formSelector, callFunc) {
    const form = document.querySelector(formSelector);
    form.addEventListener('submit', function (e) {
        callFunc(form);
    });
}
 function setFormSubmitDelCardHandler() {

  formDelCard.addEventListener('submit', function (e) {
    const cardId = formDelCard.getAttribute('data-id');
    const selector = document.querySelector(`li[data-id="${cardId}"]`)
    deletePlace(cardId, selector)
  });
}

/**
 * Закрытие popup по клику на оверлей
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
setFormSubmitDelCardHandler()
