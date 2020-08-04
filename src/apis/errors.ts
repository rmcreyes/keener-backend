/**
 * Error to be thrown when an unknown error occurs when handling an API.
 */
export class ApiUnknownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiUnknownError";
  }
}
