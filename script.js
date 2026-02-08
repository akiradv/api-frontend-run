const API = "http://api-backend-4wc5.onrender.com/";
let token = localStorage.getItem("token");

const authBox = document.getElementById("authBox");
const postBox = document.getElementById("postBox");

if (token) showPosts();

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
    authMsg.innerText = data.success ? "Registrado! Agora faça login." : "Erro ao registrar";
  });
}

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
      showPosts();
    } else {
      authMsg.innerText = "Login inválido";
    }
  });
}

function showPosts() {
  authBox.classList.add("hidden");
  postBox.classList.remove("hidden");
  loadPosts();
}

function createPost() {
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
    });
}
