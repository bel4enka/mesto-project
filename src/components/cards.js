import {initialCards} from "./initial-cards.js";
import {setFormSubmitHandler, editProfile, editAvatar,} from '../pages/index'
import { openPopup, setupPopupEventHandlers, setOpenPopupEventHandlers, closePopup} from './modal.js'
import {
  delCard,
  delLike,
  getDataUser,
  getInitialCards,
  putUserData,
  putLike,
  putNewCard,
} from './api.js'

const imagePopup = document.querySelector('.popup_type_photo');
const placeListContainer = document.querySelector('.gallery__list');
const popupPhoto = document.querySelector('.popup__photo');
const popupPhotoName = document.querySelector('.popup__photo-name');
const formElementName = document.querySelector('.form__item_el_name');
const formElementActivity = document.querySelector('.form__item_el_activity');
let nameAvatar = document.querySelector('.profile__name');
let activityAvatar = document.querySelector('.profile__activity');
let imgAvatar = document.querySelector('.profile__avatar');
let user;
const formEdit = document.querySelector('.form-edit');
let cards;

export function renderLoading(isLoading) {

  if (isLoading) {
    formEdit.querySelector('.form__button').textContent = 'Сохранение...'
  } else {
    formEdit.querySelector('.form__button').textContent = 'Сохранить'

  }
}

export function getUser () {
 return getDataUser()
    .then((res) => {
      user = {
        id: res._id,
        name: res.name,
        about: res.about,
        avatar: res.avatar
      }

    })
    .catch((e) => {
      console.log(e)
    })
}

/**
 * Добавление начальных карточек
 */
function addInitialCards() {
 return  getInitialCards()
    .then((res) => {
      cards = [];
      for(let i = 0; i < res.length; i++) {
        cards.push(res[i])
      }
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
  if (user.id.toString() !== cardData.owner.toString()) {
    card.querySelector('.photo__del').remove()
  }
}
/**
 * Проверяет является ли лайк текущего автора
 */
function isMyLike(target, selector) {
  for(let i = 0; i < target.likes.length; i++) {
    if(target.likes[i]._id.toString() === user.id.toString()) {
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




Promise.all([
  getUser(),
  addInitialCards()
]).then(() => {
    nameAvatar.textContent = user.name;
    activityAvatar.textContent = user.about;
    imgAvatar.src = user.avatar;

    cards.forEach(function (el) {
      const card = createCard(el)
      addCardToList(card);
      })
  })
  .catch(err => {
    console.error(err);
  });

setOpenPopupEventHandlers ('.popup_type_profile', '.profile__edit-button', function () {


  const form = document.querySelector('.form-edit')

  formElementName.value = nameAvatar.textContent;
  formElementActivity.value = activityAvatar.textContent;
  form.validate()

})
setOpenPopupEventHandlers('.popup_type_place', '.profile__add-button', function () {
})

setOpenPopupEventHandlers('.popup_type_avatar', '.profile__avatar-link', function () {

})
setupPopupEventHandlers()


/**
 * Вызов обработчика событий для каждой из форм. Первый аргумент селектор формы, второй название функции для вызова внутри
 */
setFormSubmitHandler('.form-edit', editProfile);

setFormSubmitHandler('.form-avatar', editAvatar);

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
  closePopup()
});
