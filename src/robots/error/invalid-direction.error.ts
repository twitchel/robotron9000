export class InvalidDirectionError extends Error {
  message =
    "Direction provided is invalid. Please either move the bot 'N', 'S', 'E' or 'W'";
}
