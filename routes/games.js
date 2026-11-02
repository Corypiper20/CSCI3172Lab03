const express = require("express");
const router = express.Router();
const store = require("../data/games");
const validateGame = require("../middleware/validateGame");

function parseId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("Invalid id parameter: must be a positive integer");
    err.status = 400;
    return next(err);
  }
  req.gameId = id;
  next();
}

router.get("/", (req, res) => {
  res.status(200).json(store.getAll());
});

router.get("/:id", parseId, (req, res, next) => {
  const game = store.getById(req.gameId);
  if (!game) {
    const err = new Error(`Game with id ${req.gameId} not found`);
    err.status = 404;
    return next(err);
  }
  res.status(200).json(game);
});

router.post("/", validateGame, (req, res) => {
  const created = store.add(req.game);
  res.status(201).json(created);
});

router.delete("/:id", parseId, (req, res, next) => {
  const removed = store.remove(req.gameId);
  if (!removed) {
    const err = new Error(`Game with id ${req.gameId} not found`);
    err.status = 404;
    return next(err);
  }
  res.status(200).json({ message: "Game deleted", game: removed });
});

module.exports = router;