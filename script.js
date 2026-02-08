const API = "https://api-backend-4wc5.onrender.com";
let token = localStorage.getItem("token");

const authBox = document.getElementById("authBox");
const postBox = document.getElementById("postBox");
const username = document.getElementById("username");
const password = document.getElementById("password");
const authMsg = document.getElementById("authMsg");
const title = document.getElementById("title");
const content = document.getElementById("content");
const feed = document.getElementById("feed");

if (token) showPosts();

function register() {
  if (!username.value || !password.value) {
    authMsg.innerText = "Preencha todos os campos";
    return;
  }

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(data => {
    authMsg.innerText = data.success 
      ? "Registrado! Agora faça login." 
      : data.error || "Erro ao registrar";
  })
  .catch(() => {
    authMsg.innerText = "Erro de conexão com a API";
  });
}

function login() {
  if (!username.value || !password.value) {
    authMsg.innerText = "Digite usuário e senha";
    return;
  }

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      showPosts();
    } else {
      authMsg.innerText = "Login inválido";
    }
  })
  .catch(() => {
    authMsg.innerText = "Erro ao conectar com a API";
  });
}

function showPosts() {
  authBox.classList.add("hidden");
  postBox.classList.remove("hidden");
  loadPosts();
}

function createPost() {
  if (!title.value || !content.value) return;

  fetch(`${API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      title: title.value,
      content: content.value
    })
  })
  .then(() => {
    title.value = "";
    content.value = "";
    loadPosts();
  });
}

function loadPosts() {
  fetch(`${API}/posts`)
    .then(r => r.json())
    .then(posts => {
      feed.innerHTML = "";

      posts.forEach(post => {
        feed.innerHTML += `
          <div class="card">
            <strong>${post.title}</strong>
            <p>${post.content}</p>
            <small>${new Date(post.created_at).toLocaleString()}</small>
          </div>
        `;
      });
    })
    .catch(() => {
      feed.innerHTML = "<p>Erro ao carregar posts</p>";
    });
}
