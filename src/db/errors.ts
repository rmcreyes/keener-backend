/**
 * Error to be thrown when a specified object cannot be found in the database.
 */
export class DbLookupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DbLookupError";
  }
}

/**
 * Error to be thrown if a connection to the database could not be made.
 */
export class DbConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DbConnectionError";
  }
}

/**
 * Error to be thrown when an unexpected error occurs in database operations.
 */
export class DbInternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DbInternalError";
  }
}