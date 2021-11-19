import {initialCards} from "./initial-cards.js";
import { setFormSubmitHandler, editProfile,  } from '../pages/index'
import {
  openPopup,
  setupPopupEventHandlers,
  setOpenPopupEventHandlers,
  closePopup
} from './modal.js'
import {
  delCard, delLike,
  getDataAvatar,
  getInitialCards,
  putDataAvatar, putLike,
  putNewCard
} from './api.js'

const imagePopup = document.querySelector('.popup_type_photo');
const placeListContainer = document.querySelector('.gallery__list');
const popupPhoto = document.querySelector('.popup__photo');
const popupPhotoName = document.querySelector('.popup__photo-name');
const formElementName = document.querySelector('.form__item_el_name');
const formElementActivity = document.querySelector('.form__item_el_activity');
let nameAvatar = document.querySelector('.profile__name');
let activityAvatar = document.querySelector('.profile__activity');
let imgAvatar = document.querySelector('.profile__avatar').src;
let user;

function getAvatar () {
  getDataAvatar()
    .then((res) => {
      nameAvatar.textContent = res.name;
      activityAvatar.textContent = res.about;
      imgAvatar = res.avatar;
      user = {id: res._id}
    })

    .catch((e) => {
      console.log(e)
    })
}

/**
 * Добавление начальных карточек
 */
function addInitialCards() {

  getInitialCards()
    .then((res) => {
      res.forEach(function (el) {
        const card = createCard(el)
        addCardToList(card);
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

/**
 * Добавляет карточку в список.
 */
function addCardToList(card) {
  placeListContainer.prepend(card);
}

/**
 * Проверяет авторство карточки и удаляет кнопку удаления
 */
function isMyCard (card, cardData) {
  getAvatar()
  if (!user.id === cardData.owner._id) {
    card.querySelector('.photo__del').remove()
  }
}
function isMyLike(target, selector) {
  for(let i = 0; i < target.likes.length; i++) {
    if(target.likes[i]._id === user.id) {
      selector.classList.add('photo__heart_active')
    }
  }
}

/**
 * Создаёт новую карточку (место).
 */
function createCard(cardData) {

  const placeTemplate = document.querySelector('#gallery-item').content;
  const card = placeTemplate.querySelector('.gallery__item').cloneNode(true);
  card.querySelector('.photo__name').textContent = cardData.name;
  card.querySelector('.photo__img').src = cardData.link;
  card.querySelector('.photo__img').alt = cardData.name;
  card.setAttribute('data-id', cardData._id)
  if (cardData.likes.length > 0) {
    card.querySelector('.photo__likes').textContent = cardData.likes.length;
    isMyLike(cardData, card.querySelector('.photo__heart'))

  }


  isMyCard(card, cardData)
  return card
}

/**
 * Удаление карточки (места)
 */
export function deletePlace(target) {
  target.closest('.gallery__item').remove()
  const cardId = target.closest('.gallery__item').getAttribute('data-id')
  delCard(cardId)

}
/**
 * Переключение состояния лайков
 */
export function toggleLike(target) {
  // target.classList.toggle('photo__heart_active')
  const cardId = target.closest('.gallery__item').getAttribute('data-id')
    if (target.classList.contains('photo__heart_active')) {
      delLike(cardId)
        .then((res) => {
          target.classList.remove('photo__heart_active')

          if (res.likes.length > 0) {
            target.nextElementSibling.textContent = res.likes.length;
          } else {
            target.nextElementSibling.textContent = '';
          }

        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      putLike(cardId)
        .then((res) => {
          if (res.likes.length > 0) {
            target.nextElementSibling.textContent = res.likes.length;
          }
          isMyLike(res, target)
        })
        .catch((e) => {
          console.log(e)
        })
    }
}

/**
 * Открывает фотографию карточки (места).
 */
export function openPlace(target) {
  const popupPhotoTarget = target.src;
  const popupPhotoNameTarget = target.closest('.gallery__item').querySelector('.photo__name').textContent;

  openPopup(imagePopup)

  popupPhotoName.textContent = popupPhotoNameTarget;
  popupPhoto.src = popupPhotoTarget;
  popupPhoto.alt = popupPhotoNameTarget;
}
getAvatar()
setOpenPopupEventHandlers ('.popup_type_profile', '.profile__edit-button', function () {


  const form = document.querySelector('.form-edit')

  formElementName.value = nameAvatar.textContent;
  formElementActivity.value = activityAvatar.textContent;
  form.validate()

})
setOpenPopupEventHandlers('.popup_type_place', '.profile__add-button', function () {
})
setupPopupEventHandlers()

addInitialCards()

/**
 * Вызов обработчика событий для каждой из форм. Первый аргумент селектор формы, второй название функции для вызова внутри
 */
setFormSubmitHandler('.form-edit', editProfile, function () {
});

/**
 * Дополнительно передаём данные из формы
 */
setFormSubmitHandler('.form-place', function (form) {

  const cardData = {
    name: document.querySelector('.form__item_el_name-place').value,
    link: document.querySelector('.form__item_el_img').value,
    likes: 0,
    owner: user.id
  }
  const card = createCard(cardData)
  addCardToList(card);
  form.resetValidate()

  putNewCard(cardData)
    .then((res) => {
     card.setAttribute('data-id', res._id)
    })
    .catch((e) => {
      console.log(e)
    })
});
