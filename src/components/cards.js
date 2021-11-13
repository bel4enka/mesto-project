import {initialCards} from "./initial-cards.js";
import { setFormSubmitHandler, editProfile,  } from '../pages/index'
import { openPopup, setupPopupEventHandlers, setOpenPopupEventHandlers } from './modal.js'

const imagePopup = document.querySelector('.popup_type_photo');
const placeListContainer = document.querySelector('.gallery__list');
const popupPhoto = document.querySelector('.popup__photo');
const popupPhotoName = document.querySelector('.popup__photo-name');
const formElementName = document.querySelector('.form__item_el_name');
const formElementActivity = document.querySelector('.form__item_el_activity');

/**
 * Добавление начальных карточек
 */
function addInitialCards(initialCards) {
  initialCards.forEach(function (el) {
    const card = createCard(el)
    addCardToList(card);
  })
}

/**
 * Добавляет карточку в список.
 */
function addCardToList(card) {
  placeListContainer.prepend(card);
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

  return card
}

/**
 * Удаление карточки (места)
 */
export function deletePlace(target) {
  target.closest('.gallery__item').remove()
}
/**
 * Переключение состояния лайков
 */
export function toggleLike(target) {
  target.classList.toggle('photo__heart_active')
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

setOpenPopupEventHandlers ('.popup_type_profile', '.profile__edit-button', function () {

  const name = document.querySelector('.profile__name').textContent;
  const activity = document.querySelector('.profile__activity').textContent;
  const form = document.querySelector('.form-edit')

  formElementName.value = name;
  formElementActivity.value = activity;
  form.validate()
})
setOpenPopupEventHandlers('.popup_type_place', '.profile__add-button', function () {
})
setupPopupEventHandlers()

addInitialCards(initialCards)

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
    link: document.querySelector('.form__item_el_img').value
  }
  const card = createCard(cardData)
  addCardToList(card);
  form.resetValidate()
});
