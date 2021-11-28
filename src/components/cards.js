import { setFormSubmitHandler, editProfile, editAvatar, placeContainerEventHandlers } from '../pages/index'
import { openPopup, setupPopupEventHandlers, setOpenPopupEventHandlers, closePopup } from './modal.js'
import { delCard, delLike, getUserData, getInitialCards, putLike, putNewCard,} from './api.js'

const imagePopup = document.querySelector('.popup_type_photo');
const placeListContainer = document.querySelector('.gallery__list');
const popupPhoto = document.querySelector('.popup__photo');
const popupPhotoName = document.querySelector('.popup__photo-name');
const formElementName = document.querySelector('.form__item_el_name');
const formElementActivity = document.querySelector('.form__item_el_activity');
const nameAvatar = document.querySelector('.profile__name');
const activityAvatar = document.querySelector('.profile__activity');
const imgAvatar = document.querySelector('.profile__avatar');
let currentUser;
let currentCards;
const formPlace = document.querySelector('.form-place')

export function renderLoading(isLoading, form) {
  const button = form.querySelector('.form__button')
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить'
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
  const cardDelButton = card.querySelector('.photo__del');
  if (currentUser.id.toString() !== cardData.owner.toString()) {
    cardDelButton.remove()
  }

  cardDelButton.addEventListener('click', function (e) {
    const target = e.target;
    const popup = document.querySelector('.popup_type_confirm')

    openPopup(popup)
    const idCard = target.closest('.gallery__item').getAttribute('data-id');
    popup.querySelector('.form-confirm').setAttribute('data-id', idCard)
  })

}

/**
 * Создаёт новую карточку (место).
 */
function createCard(cardData) {

  const placeTemplate = document.querySelector('#gallery-item').content;
  const card = placeTemplate.querySelector('.gallery__item').cloneNode(true);
  const cardImage = card.querySelector('.photo__img');
  const cardLikeCount = card.querySelector('.photo__likes');
  const cardLikeButton = card.querySelector('.photo__heart');

  card.querySelector('.photo__name').textContent = cardData.name;
  cardImage.src = cardData.link;
  card.querySelector('.photo__img').alt = cardData.name;
  card.setAttribute('data-id', cardData.id)

  if (cardData.likes.length > 0) {
    cardLikeCount.textContent = cardData.likes.length;
    if (cardData.likes.includes(currentUser.id)) {
      cardLikeButton.classList.add('photo__heart_active')
    }
  }

  isMyCard(card, cardData)

  cardLikeButton.addEventListener('click', function (e) {
    const target = e.target;
    toggleLike(target)
  })
  cardImage.addEventListener('click', function (e) {
    const target = e.target;
    openPlace(target)
  })
  return card
}

/**
 * Удаление карточки (места)
 */
export function deletePlace(idCard, selector) {

  delCard(idCard)
    .then((res) => {
      selector.closest('.gallery__item').remove()
      closePopup()
    })
    .catch((e) => {
      console.log(e)
    })
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
  getUserData(),
  getInitialCards()
])

  .then(([user, cards]) => {
    currentUser = user;

    nameAvatar.textContent = currentUser.name;
    activityAvatar.textContent = currentUser.about;
    imgAvatar.src = currentUser.avatar;


    currentCards = cards;
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
  renderLoading(true, formPlace)

  putNewCard(cardData)

    .then((res) => {
      const card = createCard(cardData)
      addCardToList(card);
      form.resetValidate()
      card.setAttribute('data-id', res._id)
      closePopup()
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      renderLoading(false, formPlace)
    });
});
