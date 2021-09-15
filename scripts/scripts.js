/**
 * Обработчик события на popup
 */
function openPopupEventHandlers(popupSelector, openSelector) {
  const popup = document.querySelector(popupSelector)
  document.querySelector(openSelector).addEventListener('click', () => openPopup(popup))

}
/**
 * Заполняем профиль
 */
function setDataFormInput () {
  const name = document.querySelector('.profile__name').textContent;
  const activity = document.querySelector('.profile__activity').textContent;

  document.querySelector('.form__item_el_name').value = name;
  document.querySelector('.form__item_el_activity').value = activity;
}
/**
 * Открытие popup
 */
function openPopup (popup) {
  popup.classList.add('popup_opened')
  setDataFormInput()
}

/**
 * Закрытие карточки
 */
function closePopup() {
  document.querySelector('.popup_opened').classList.remove('popup_opened');
}

/**
 * Обработчик события на крестик popup
 */
function setupPopupEventHandlers () {
  const closePopupButtons = document.querySelectorAll('.popup__close');

  closePopupButtons.forEach((element) => element
    .addEventListener('click', closePopup))
}

/**
 * Добавление начальных карточек
 */
function addInitialCards(initialCards) {
  initialCards.forEach(function (el) {
    const card = createCard(el)
    addCardToList(card);
  })}

/**
 * Добавляет карточку в список.
 */
function addCardToList(card) {
  const placeListContainer = document.querySelector('.gallery__list');
  placeListContainer.prepend(card);
}

/**
 * Создаёт новую карточку (место).
 */
function createCard (cardData) {
  const placeTemplate = document.querySelector('#gallery-item').content;
  const card = placeTemplate.querySelector('.gallery__item').cloneNode(true);
  card.querySelector('.photo__name').textContent = cardData.name;
  card.querySelector('.photo__img').src = cardData.link;
  card.querySelector('.photo__img').alt = cardData.name;

  return card
}

/**
 * Редактирование профиля
 */
function editProfile () {
  const name = document.querySelector('.form__item_el_name').value;
  const activity = document.querySelector('.form__item_el_activity').value;
  const profileName = document.querySelector('.profile__name')
  const profileActivity = document.querySelector('.profile__activity');

  profileName.textContent = name;
  profileActivity.textContent = activity;

}
/**
 * Обработчик события на формы ввода
 */
function getDataInput (formSelector, callFunc) {
  document.querySelector(formSelector).addEventListener('submit', function (e) {

    closePopup()
    e.preventDefault()
    callFunc();
    document.querySelector(formSelector).reset();
  });
}
/**
 * Удаление карточки (места)
 */
function deletePlace(target) {
  target.closest('.gallery__item').remove()
}
/**
 * Переключение состояния лайков
 */
function toggleLike(target) {
  target.classList.toggle('photo__heart_active')
}

/**
 * открытие увеличенной фотографии карточки (места)
 */
function openPlace(target) {
  const popup = document.querySelector('.popup_type_photo');
  const popupPhotoTarget = target.src;
  const popupPhoto = document.querySelector('.popup__photo');
  const popupPhotoName = document.querySelector('.popup__photo-name');
  const popupPhotoNameTarget = target.closest('.gallery__item').querySelector('.photo__name').textContent;

  openPopup(popup)
  setupPopupEventHandlers()

  popupPhotoName.textContent = popupPhotoNameTarget;
  popupPhoto.src = popupPhotoTarget;
  popupPhoto.alt = popupPhotoNameTarget;
}
/**
 * Обработчики событий на общий контейнер с фотографиями Мест
 */
document.querySelector('.gallery__list').addEventListener('click', function (e) {
   const target = e.target;

   if (target.classList.contains('photo__del')) {
     deletePlace(target)
   }
   else if (target.classList.contains('photo__heart')) {
     toggleLike(target)
   }
   else if (target.classList.contains('photo__img')) {
     openPlace(target)
   }})


openPopupEventHandlers('.popup_type_profile', '.profile__edit-button')
openPopupEventHandlers('.popup_type_place', '.profile__add-button')
setupPopupEventHandlers()

addInitialCards(initialCards)

/**
 * Вызов обработчика событий для каждой из форм. Первый аргумент селектор формы, второй название функции для вызова внутри
 */
getDataInput('.form-edit', editProfile);

/**
 * Дополнительно передаём данные из формы
 */
getDataInput('.form-place', function () {

  const cardData = {
    name: document.querySelector('.form__item_el_name-place').value,
    link: document.querySelector('.form__item_el_img').value
  }
  const card = createCard(cardData)
  addCardToList(card);
});
