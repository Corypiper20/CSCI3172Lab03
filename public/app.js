// const API_BASE = "https://YOUR-APP-NAME.onrender.com/api/games";
const API_BASE = "http://localhost:3000/api/games";

const form = document.getElementById("game-form");
const list = document.getElementById("game-list");
const message = document.getElementById("form-message");
const refreshBtn = document.getElementById("refresh-btn");

function setMessage(text, type) {
  message.textContent = text || "";
  message.className = "message" + (type ? " " + type : "");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function loadGames() {
  list.innerHTML = '<p class="empty">Loading...</p>';
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const games = await res.json();

    if (!Array.isArray(games) || games.length === 0) {
      list.innerHTML = '<p class="empty">No games yet — add one!</p>';
      return;
    }

    list.innerHTML = games.map(renderCard).join("");

    list.querySelectorAll("[data-delete-id]").forEach((btn) => {
      btn.addEventListener("click", () => deleteGame(btn.dataset.deleteId));
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p class="empty">Failed to load games: ${escapeHtml(err.message)}</p>`;
  }
}

function renderCard(game) {
  const statusClass = game.status.toLowerCase();
  const ratingText =
    game.status === "Wishlist" && !game.rating
      ? "Not rated"
      : `★ ${Number(game.rating).toFixed(1)}/10`;
  const genre = game.genre ? ` · ${escapeHtml(game.genre)}` : "";

  return `
    <div class="game-card ${statusClass}">
      <h3 class="game-title">${escapeHtml(game.title)}</h3>
      <p class="game-meta">${escapeHtml(game.platform)}${genre}</p>
      <p class="game-rating">${ratingText}</p>
      <span class="badge ${game.status}">${game.status}</span>
      <div class="card-actions">
        <button class="btn btn-delete" data-delete-id="${game.id}">Delete</button>
      </div>
    </div>
  `;
}

async function deleteGame(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `HTTP ${res.status}`);
    }
    setMessage(`Deleted "${data.game.title}".`, "success");
    loadGames();
  } catch (err) {
    setMessage(`Delete failed: ${err.message}`, "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("");

  const payload = {
    title: form.title.value.trim(),
    platform: form.platform.value.trim(),
    status: form.status.value,
    rating: parseFloat(form.rating.value),
    genre: form.genre.value.trim() || undefined
  };

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      const details = data.error?.details?.join(" · ") || data.error?.message || `HTTP ${res.status}`;
      throw new Error(details);
    }

    setMessage(`Added "${data.title}"!`, "success");
    form.reset();
    form.rating.value = 8;
    loadGames();
  } catch (err) {
    setMessage(`Error: ${err.message}`, "error");
  }
});

refreshBtn.addEventListener("click", loadGames);

// Initial load
loadGames();