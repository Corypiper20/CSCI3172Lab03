let games = [
  {
    id: 1,
    title: "Hollow Knight",
    platform: "PC",
    status: "Completed",
    rating: 9.5,
    genre: "Metroidvania"
  },
  {
    id: 2,
    title: "Hades",
    platform: "PC",
    status: "Playing",
    rating: 9.0,
    genre: "Roguelike"
  },
  {
    id: 3,
    title: "Celeste",
    platform: "PC",
    status: "Completed",
    rating: 9.2,
    genre: "Platformer"
  },
  {
    id: 4,
    title: "Stardew Valley",
    platform: "PC",
    status: "Playing",
    rating: 8.8,
    genre: "Farming Sim"
  },
  {
    id: 5,
    title: "Outer Wilds",
    platform: "PC",
    status: "Wishlist",
    rating: 0,
    genre: "Exploration"
  },
  {
    id: 6,
    title: "Undertale",
    platform: "PC",
    status: "Completed",
    rating: 9.0,
    genre: "RPG"
  }
];

let nextId = games.length + 1;

function getAll() {
  return games;
}

function getById(id) {
  return games.find((g) => g.id === id);
}

function add(game) {
  const newGame = { id: nextId++, ...game };
  games.push(newGame);
  return newGame;
}

function remove(id) {
  const index = games.findIndex((g) => g.id === id);
  if (index === -1) return null;
  const [removed] = games.splice(index, 1);
  return removed;
}

module.exports = { getAll, getById, add, remove };