const VALID_STATUSES = ["Playing", "Completed", "Wishlist"];

function validateGame(req, res, next) {
  const { title, platform, status, rating, genre } = req.body || {};
  const errors = [];

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required and must be a non-empty string");
  }

  if (typeof platform !== "string" || platform.trim().length === 0) {
    errors.push("platform is required and must be a non-empty string");
  }

  if (!VALID_STATUSES.includes(status)) {
    errors.push(`status is required and must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (
    typeof rating !== "number" ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 10
  ) {
    errors.push("rating is required and must be a number between 0 and 10");
  }

  if (genre !== undefined && typeof genre !== "string") {
    errors.push("genre must be a string when provided");
  }

  if (errors.length > 0) {
    const err = new Error("Invalid game payload");
    err.status = 400;
    err.details = errors;
    return next(err);
  }

  req.game = {
    title: title.trim(),
    platform: platform.trim(),
    status,
    rating,
    genre: genre ? genre.trim() : null
  };

  next();
}

module.exports = validateGame;