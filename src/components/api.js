import {charAt} from "core-js/internals/string-multibyte";

const config = {
  baseUrl: 'https://nomoreparties.co/v1/plus-cohort-4',
  headers: {
    authorization: '18c42fb3-2954-4000-8256-0fa0e8a226b6',
    'Content-Type': 'application/json'
  }
}

const parseResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Ошибка ${res.status}`)
}

export function getUserData() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(parseResponse)
    .then((user) => {
      // Преобразуем ответ сервера в наше внутреннее представление. Далее с цепочкой работаем в файле cards
      return {
        id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar
      }
    })
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    }
  )
    .then(parseResponse)
    //Здесь создаём свою переменную для того, чтобы убрать сопряжение с api. Далее с цепочкой работаем в файле cards
    .then((cards) => {
      return cards.map((card) => {
        return {
          id: card._id,
          name: card.name,
          owner: card.owner._id,
          link: card.link,
          likes: card.likes.map((whoLiked) => {
            return whoLiked._id
          })
        }
      })
    })
}


export function putUserData(avatar) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: avatar.name,
      about: avatar.about,
    })
  })
    .then(parseResponse)
}


export function putNewCard(card) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: card.name,
      link: card.link,
    })
  })
    .then(parseResponse)
}

export const delCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(parseResponse)
}

export function putLike(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  })
    .then(parseResponse)

}

export const delLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(parseResponse)
}

export function putImgAvatar(avatarImg) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarImg.avatar
    })

  })
    .then(parseResponse)
}
