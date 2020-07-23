/**
 * Data model for a user.
 */
export default class User {
  private _id: number;
  private _username: string;

  /**
   * Constructor of the user model.
   *
   * @param id ID of the user
   * @param username username of the user
   */
  constructor(id: number, username: string) {
    this._id = id;
    this._username = username;
  }

  /**
   * Getter method for the user's ID.
   *
   * @returns ID of the user
   */
  get id(): number {
    return this._id;
  }

  /**
   * Getter method for the user's username. yaa
   *
   * @returns username of the user
   */
  get username(): string {
    return this._username;
  }

  /**
   * Setter method for a user's new username.
   */
  set username(newUsername: string) {
    this._username = newUsername;
  }
}
