const config = {
  baseUrl: 'https://nomoreparties.co/v1/plus-cohort-4',
  headers: {
    authorization: '18c42fb3-2954-4000-8256-0fa0e8a226b6',
    'Content-Type': 'application/json'
  }
}

const parseResponse = (res) => {
  if(res.ok){
    return res.json();
  }

  return Promise.reject(`Ошибка ${res.status}`)
}

export function getDataUser () {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(parseResponse)
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    }
  )
    .then(parseResponse)
}


export function putUserData (avatar) {
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


export function putNewCard (card) {
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
export function putLike (cardId) {
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

export function putImgAvatar (avatarImg) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarImg.avatar
    })

  })
    .then(parseResponse)
}
