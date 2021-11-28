import './index.css';

import {enableValidation} from '../components/validate.js';
import {closePopup} from '../components/modal.js';
import {deletePlace, renderLoading} from '../components/cards.js';
import {putUserData, putImgAvatar, putLike} from "../components/api";


const name = document.querySelector('.form__item_el_name');
const activity = document.querySelector('.form__item_el_activity');
const profileName = document.querySelector('.profile__name')
const profileActivity = document.querySelector('.profile__activity');
const profileAvatar = document.querySelector('.profile__avatar');
const formDelCard = document.querySelector('.form-confirm');
const avatarLink = document.querySelector('#link-avatar-input');
const formEdit = document.querySelector('.form-edit');
const formAvatar = document.querySelector('.form-avatar');

/**
 * Редактирование профиля
 */
export function editProfile() {

  const
    profileData = {
    name: name.value,
    about: activity.value,
  }

  renderLoading(true, formEdit)

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
      renderLoading(false, formEdit)
    });
}

/**
 * Редактирование аватара
 */
export function editAvatar() {
  renderLoading(true, formAvatar)

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
    .finally(() => {
      renderLoading(false, formAvatar)
    });
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
