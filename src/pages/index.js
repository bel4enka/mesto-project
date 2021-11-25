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
/**
 * Редактирование профиля
 */
export function editProfile() {
   profileName.textContent = name.value;
   profileActivity.textContent = activity.value;

  const
    avatar = {
    name: name.value,
    about: activity.value,
  }

  renderLoading(true)

  putUserData(avatar)
    .then((res) => {
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      renderLoading(false)
      closePopup()
    });
}

/**
 * Редактирование аватара
 */
export function editAvatar() {
  const avatarLink = document.querySelector('#link-avatar-input').value;
  profileAvatar.src = avatarLink;

  const avatarImg = {
    avatar: avatarLink
  }
  putImgAvatar(avatarImg)
  closePopup()

}
/**
 * Обработчики событий на общий контейнер с фотографиями Мест
 */
document.querySelector('.gallery__list').addEventListener('click', function (e) {
  const target = e.target;

  if (target.classList.contains('photo__del')) {
    // deletePlace(target)
    const popup = document.querySelector('.popup_type_confirm')
    openPopup(popup)
    const idCard = target.closest('.gallery__item').getAttribute('data-id')
    setFormSubmitDelCardHandler('.form-confirm', idCard, target);
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
        callFunc(form);
    });
}
export function setFormSubmitDelCardHandler(formSelector, idCard, selector) {
  const form = document.querySelector(formSelector);
  form.addEventListener('submit', function (e) {
    deletePlace(idCard, selector)
    closePopup()
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
