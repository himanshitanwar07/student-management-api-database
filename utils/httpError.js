// Small helper so models/routes can throw errors that carry an HTTP status code
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Validates a numeric id and returns it (throws 400 otherwise)
function parseId(value, label = "id") {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `Invalid ${label}. It must be a positive number.`);
  }
  return id;
}

module.exports = { HttpError, parseId };
