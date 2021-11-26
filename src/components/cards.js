import { setFormSubmitHandler, editProfile, editAvatar } from '../pages/index'
import { openPopup, setupPopupEventHandlers, setOpenPopupEventHandlers, closePopup } from './modal.js'
import { delCard, delLike, getUserData, getInitialCards, putLike, putNewCard,} from './api.js'

const imagePopup = document.querySelector('.popup_type_photo');
const placeListContainer = document.querySelector('.gallery__list');
const popupPhoto = document.querySelector('.popup__photo');
const popupPhotoName = document.querySelector('.popup__photo-name');
const formElementName = document.querySelector('.form__item_el_name');
const formElementActivity = document.querySelector('.form__item_el_activity');
let nameAvatar = document.querySelector('.profile__name');
let activityAvatar = document.querySelector('.profile__activity');
let imgAvatar = document.querySelector('.profile__avatar');
let currentUser;
const formEdit = document.querySelector('.form-edit');
let currentCards;

export function renderLoading(isLoading) {

  if (isLoading) {
    formEdit.querySelector('.form__button').textContent = 'Сохранение...'
  } else {
    formEdit.querySelector('.form__button').textContent = 'Сохранить'
  }
}

export function getUser () {
 return getUserData()
    .then((user) => {
      currentUser = user
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
    .then((cards) => {
      currentCards = cards}
    )
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

  if (currentUser.id.toString() !== cardData.owner.toString()) {
    card.querySelector('.photo__del').remove()
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
  card.setAttribute('data-id', cardData.id)

  if (cardData.likes.length > 0) {
    card.querySelector('.photo__likes').textContent = cardData.likes.length;
    if (cardData.likes.includes(currentUser.id)) {
      card.querySelector('.photo__heart').classList.add('photo__heart_active')
    }
  }

  isMyCard(card, cardData)
  return card
}

/**
 * Удаление карточки (места)
 */
export function deletePlace(idCard, selector) {
  console.log(idCard +' из deletePlace')
  selector.closest('.gallery__item').remove()
  delCard(idCard)
  closePopup()

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
          target.classList.add('photo__heart_active')
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

/**
 * Получаем юзера и карточки одновременно
 */
Promise.all([
  getUser(),
  addInitialCards()
]).then(() => {
    nameAvatar.textContent = currentUser.name;
    activityAvatar.textContent = currentUser.about;
    imgAvatar.src = currentUser.avatar;

    currentCards.forEach(function (el) {
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
    owner: currentUser.id
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
