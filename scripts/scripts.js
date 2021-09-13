const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
  }
];

//Открытие, закрытие popup
function createPopup(popupSelector, openSelector) {
  const popup = document.querySelector(popupSelector)

  document.querySelector(openSelector).addEventListener('click', () => popup.classList.add('popup_opened'))
  popup.querySelector('.popup__close').addEventListener('click', () => popup.classList.remove('popup_opened'))
}

//Добавление начальных карточек
function addInitialCards(initialCards) {
  for (let i = 0; i < initialCards.length; i++) {
    addPlace(initialCards[i].name, initialCards[i].link)
  }
}

//Добавление нового элемента - Места (фотографии с подписью)
function addPlace (name, link) {
  const placeTemplate = document.querySelector('#gallery-item').content;
  const placeElement = placeTemplate.querySelector('.gallery__item').cloneNode(true);
  const placeListContainer = document.querySelector('.gallery__list');
  placeElement.querySelector('.photo__name').textContent = name;
  placeElement.querySelector('.photo__img').src = link;
  placeListContainer.append(placeElement);
}

//Редактирование профиля
function editProfile () {
  const name = document.querySelector('.form__item_el_name').value;
  const activity = document.querySelector('.form__item_el_activity').value;
  const profileName = document.querySelector('.profile__name')
  const profileActivity = document.querySelector('.profile__activity');

  profileName.textContent = name;
  profileActivity.textContent = activity;
}

//Обработчик события на формы ввода
function getDataInput (formSelector, callFunc) {
  document.querySelector(formSelector).addEventListener('submit', function (e) {
    document.querySelector('.popup_opened').classList.remove('popup_opened');

    e.preventDefault()
    callFunc();
  });
}

//Удаление Места (фотографии)
function dellPlace(target) {
  target.closest('.gallery__item').remove()
}

//Переключение состояния лайков
function toggleLike(target) {
  target.classList.toggle('photo__heart_active')
}

//открытие увеличенной фотографии Места
function openPlace(target) {
  const popup = document.querySelector('.popup-photo');
  const popupPhotoTarget = target.src;
  const popupPhoto = document.querySelector('.popup__photo');
  const popupPhotoName = document.querySelector('.popup__photo-name');
  const popupPhotoNameTarget = target.closest('.gallery__item').querySelector('.photo__name').textContent;

  popup.classList.add('popup_opened')
  popup.querySelector('.popup__close').addEventListener('click', () => popup.classList.remove('popup_opened'))

  popupPhotoName.textContent = popupPhotoNameTarget;
  popupPhoto.src = popupPhotoTarget;
  popupPhoto.alt = popupPhotoNameTarget;
}

//Обработчики событий на общий контейнер с фотографиями Мест
document.querySelector('.gallery__list').addEventListener('click', function (e) {
   const target = e.target;

   if (target.classList.contains('photo__del')) {
     dellPlace(target)
   }
   else if (target.classList.contains('photo__heart')) {
     toggleLike(target)
   }
   else if (target.classList.contains('photo__img')) {
     openPlace(target)
   }})

createPopup('.popup-profile', '.profile__edit-button')
createPopup('.popup-place', '.profile__add-button')
addInitialCards(initialCards)

//Вызов обработчика событий для каждой из форм. Первый аргумент селектор формы, второй название функции для вызова внутри
getDataInput('.form-edit', editProfile);

//Дополнительно передаём данные из формы
getDataInput('.form-place', function () {
  const name = document.querySelector('.form__item_el_name-place').value;
  const link = document.querySelector('.form__item_el_img').value;
  addPlace(name, link)
});
