import DatabaseDriver from "db/drivers/driver";
import User from "models/user";
import StudyGroup from "models/group";
import Flashcard from "models/flashcard";
import Deck from "models/deck";

/**
 * Adapter class for database implementation.
 * All database accesses are made through this class to hide the database implementation.
 */
export default class DatabaseAdapter {
  private driver: DatabaseDriver;

  /**
   * Constructor of the database adapter.
   *
   * @param driver database driver to abstract the implementation of
   */
  constructor(driver: DatabaseDriver) {
    this.driver = driver;
  }

  /**
   * Performs anything required to start communicating with the database.
   *
   * @returns a promise that attempts to authenticate
   *          with the database and set up the tables
   * @throws DbConnectionError if something goes wrong when connecting to
   *         or synchronizing with the database
   */
  public setUp(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .setUp()
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Gets a user from the database given their ID.
   *
   * @param id ID of the user to get
   * @returns promise containing the desired user if resolved
   * @throws DbLookupError if the user could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this.driver
        .getUser(id)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  /**
   * Creates a user in the database.
   *
   * @param username username of the user to create
   * @returns promise containing newly created user if resolved
   * @throws DbInternalError if the database operation fails
   */
  public createUser(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.driver
        .createUser(username)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  /**
   * Deletes a user in the database.
   *
   * @param id ID of the user to delete
   * @returns promise that resolves if the user was deleted
   * @throws DbLookupError if the user to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .deleteUser(id)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Update a user in the database.
   *
   * @param user user to update with the updated fields
   * @returns promise that resolves if the user was updated
   * @throws DbLookupError if the user to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .updateUser(user)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Gets a study group from the database given its ID.
   *
   * @param id ID of the study group to get
   * @returns promise containing the desired study group if resolved
   * @throws DbLookupError if the study group could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getStudyGroup(id: number): Promise<StudyGroup> {
    return new Promise((resolve, reject) => {
      this.driver
        .getStudyGroup(id)
        .then((studyGroup) => resolve(studyGroup))
        .catch((err) => reject(err));
    });
  }

  /**
   * Creates a study group in the database.
   *
   * @param groupName group name of the study group to create
   * @returns promise containing newly created study group if resolved,
   *          and an error message if rejected
   * @throws DbInternalError if the database operation fails
   */
  public createStudyGroup(groupName: string): Promise<StudyGroup> {
    return new Promise((resolve, reject) => {
      this.driver
        .createStudyGroup(groupName)
        .then((studyGroup) => resolve(studyGroup))
        .catch((err) => reject(err));
    });
  }

  /**
   * Deletes a study group in the database.
   *
   * @param id ID of the study group to delete
   * @returns promise that resolves if the study group was deleted
   * @throws DbLookupError if the study group to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteStudyGroup(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .deleteStudyGroup(id)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Update a user in the database.
   *
   * @param studyGroup study group to update with the updated fields
   * @returns promise that resolves if the study group was updated
   * @throws DbLookupError if the study group to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateStudyGroup(studyGroup: StudyGroup): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .updateStudyGroup(studyGroup)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Gets a flashcard from the database given its ID.
   *
   * @param id ID of the flashcard to get
   * @returns promise containing the desired flashcard if resolved
   * @throws DbLookupError if the flashcard could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getFlashcard(id: number): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      this.driver
        .getFlashcard(id)
        .then((flashcard) => resolve(flashcard))
        .catch((err) => reject(err));
    });
  }

  /**
   * Creates a flashcard in the database.
   *
   * @param question question of the flashcard to create
   * @param answer answer of the flashcard to create
   * @param creatorId ID of the user who created this flashcard
   * @param deckId ID of the deck this flashcard belongs to
   * @returns promise containing newly created flashcard if resolved
   * @throws DbInternalError if the database operation fails
   */
  public createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      this.driver
        .createFlashcard(question, answer, creatorId, deckId)
        .then((flashcard) => resolve(flashcard))
        .catch((err) => reject(err));
    });
  }

  /**
   * Deletes a flashcard in the database.
   *
   * @param id ID of the flashcard to delete
   * @returns promise that resolves if the flashcard was deleted
   * @throws DbLookupError if the flashcard to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteFlashcard(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .deleteFlashcard(id)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Update a flashcard in the database.
   *
   * @param flashcard flashcard to update with the updated fields
   * @returns promise that resolves if the flashcard was updated
   * @throws DbLookupError if the flashcard to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateFlashcard(flashcard: Flashcard): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .updateFlashcard(flashcard)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Gets a deck from the database given its ID.
   *
   * @param id ID of the deck to get
   * @returns promise containing the desired deck if resolved
   * @throws DbLookupError if the deck could not be found
   * @throws DbInternalError if the database operation fails
   */
  public getDeck(id: number): Promise<Deck> {
    return new Promise((resolve, reject) => {
      this.driver
        .getDeck(id)
        .then((deck) => resolve(deck))
        .catch((err) => reject(err));
    });
  }

  /**
   * Creates a deck in the database.
   *
   * @param deckName name of the deck to create
   * @param creatorId ID of the user who created this deck
   * @param groupId ID of the group this deck belongs to
   * @returns promise containing newly created deck if resolved
   * @throws DbInternalError if the database operation fails
   */
  public createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<Deck> {
    return new Promise((resolve, reject) => {
      this.driver
        .createDeck(deckName, creatorId, groupId)
        .then((deck) => resolve(deck))
        .catch((err) => reject(err));
    });
  }

  /**
   * Deletes a deck in the database.
   *
   * @param id ID of the deck to delete
   * @returns promise that resolves if the deck was deleted
   * @throws DbLookupError if the deck to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  public deleteDeck(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .deleteDeck(id)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  /**
   * Update a deck in the database.
   *
   * @param deck deck to update with the updated fields
   * @returns promise that resolves if the deck was updated
   * @throws DbLookupError if the deck to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  public updateDeck(deck: Deck): Promise<void> {
    return new Promise((resolve, reject) => {
      this.driver
        .updateDeck(deck)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }
}
