const cards = [];

let users, posts;

class Card {
  constructor(postId, title, text, name, email) {
    this._postId = postId;
    this._title = title;
    this._text = text;
    this._name = name;
    this._email = email;
  }
}

async function fetchUsers() {
  const usersResponse = await fetch(
    'https://ajax.test-danit.com/api/json/users'
  );
  const usersData = await usersResponse.json();
  return usersData;
}

async function fetchPosts() {
  const postsResponse = await fetch(
    'https://ajax.test-danit.com/api/json/posts'
  );
  const postsData = await postsResponse.json();
  return postsData;
}

async function loadInfoCardsAsync() {
  [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
  posts.forEach((post) => {
    let postOwner = users.find((user) => user.id === post.userId);
    cards.push(
      new Card(post.id, post.title, post.body, postOwner.name, postOwner.email)
    );
  });
}

function createCardHTML(card) {
  const cardBlock = document.createElement('div');
  cardBlock.classList.add('card');
  cardBlock.dataset.postid = card._postId;
  cardBlock.innerHTML = `
  <div class="card-header">
  <div class="user-info">
  <span class="user-name">${card._name}</span>
  <span class="user-email">${card._email}</span>
  </div>
  <div class="card-title">${card._title}</div>
  </div>
  <div class="card-body"> <div class="card-text">${card._text}</div></div>
  <div class="button"> <button class="button__delete" data-postId="${card._postId}">Видалити</button> </div>
  `;
  return cardBlock;
}

function displayAllCards(cards) {
  const rootElement = document.querySelector('.root');
  const cardHTMLElements = cards.map((card) => createCardHTML(card));
  cardHTMLElements.forEach((cardHTMLElement) =>
    rootElement.append(cardHTMLElement)
  );
}

async function loadAndDisplayCards() {
  await loadInfoCardsAsync();
  displayAllCards(cards);
  const deleteButtons = document.querySelectorAll('.button__delete');
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', async (event) => {
      const postId = event.target.dataset.postid;
      const response = await fetch(
        `https://ajax.test-danit.com/api/json/posts/${postId}`,
        {
          method: `DELETE`,
        }
      );
      if (response.ok) {
        const deleteCard = document.querySelector(`[data-postid="${postId}"]`);
        deleteCard.remove();
      }
    });
  });
}

loadAndDisplayCards();
