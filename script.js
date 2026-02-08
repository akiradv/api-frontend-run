const API = "https://api-backend-4wc5.onrender.com";

let token = localStorage.getItem("token");

const authBox = document.getElementById("authBox");
const postBox = document.getElementById("postBox");
const feed = document.getElementById("feed");
const authMsg = document.getElementById("authMsg");

const username = document.getElementById("username");
const password = document.getElementById("password");

const title = document.getElementById("title");
const content = document.getElementById("content");

// Sessão inicial
if (token) {
  showPosts();
} else {
  authBox.classList.remove("hidden");
  postBox.classList.add("hidden");
}

// REGISTRAR
function register() {
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
      : (data.error || "Erro ao registrar");
  })
  .catch(() => {
    authMsg.innerText = "Erro ao conectar com a API";
  });
}

// LOGIN
function login() {
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
      authMsg.innerText = "";
      showPosts();
    } else {
      authMsg.innerText = data.error || "Login inválido";
    }
  })
  .catch(() => {
    authMsg.innerText = "Erro ao conectar com a API";
  });
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  token = null;

  postBox.classList.add("hidden");
  authBox.classList.remove("hidden");
}

// MOSTRAR POSTS
function showPosts() {
  if (!token) return;

  authBox.classList.add("hidden");
  postBox.classList.remove("hidden");
  loadPosts();
}

// CRIAR POST
function createPost() {
  if (!token) return alert("Faça login!");

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
  .then(r => r.json())
  .then(() => {
    title.value = "";
    content.value = "";
    loadPosts();
  })
  .catch(() => alert("Erro ao criar post"));
}

// CARREGAR POSTS
function loadPosts() {
  fetch(`${API}/posts`)
    .then(r => r.json())
    .then(posts => {
      feed.innerHTML = "";

      posts.reverse().forEach(post => {
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
