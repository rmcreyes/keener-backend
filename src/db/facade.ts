import User from "models/user";
import StudyGroup from "models/group";
import Flashcard from "models/flashcard";
import Deck from "models/deck";
/**
 * Abstract class for a database facade.
 */
export default abstract class DatabaseFacade {
  /**
   * Perform any database specific bootstrap sequence as the server starts up.
   *
   * @returns a promise that resolves if we are able to successfully authenticate
               and synchronize with the database
   * @throws DbConnectionError if something goes wrong when connecting to
   *         or synchronizing with the database
   */
  abstract setUp(): Promise<void>;

  /**
   * Gets a user from the database.
   *
   * @param id ID of the user to get
   * @returns promise that resolves with the desired user if found
   * @throws DbLookupError if the user could not be found
   * @throws DbInternalError if the database operation fails
   */
  abstract getUser(id: number): Promise<User>;

  /**
   * Adds a user to the database.
   *
   * @param username username of the user to create
   * @returns promise that resolves with the newly created user if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  abstract createUser(username: string): Promise<User>;

  /**
   * Deletes a user from the database.
   *
   * @param id ID of the user to delete
   * @returns promise that resolves if the user was deleted
   * @throws DbLookupError if the user to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  abstract deleteUser(id: number): Promise<void>;

  /**
   * Updates a user in the database.
   *
   * @param user user to update with the updated fields
   * @returns promise that resolves with the updated user if the update was successful
   * @throws DbLookupError if the user to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  abstract updateUser(user: User): Promise<User>;

  /**
   * Gets a study group from the database.
   *
   * @param id ID of the study group to get
   * @returns promise that resolves with the desired study group if found
   * @throws DbLookupError if the study group could not be found
   * @throws DbInternalError if the database operation fails
   */
  abstract getStudyGroup(id: number): Promise<StudyGroup>;

  /**
   * Adds a study group to the database.
   *
   * @param groupName group name of the study group to create
   * @returns promise that resolves with the newly created study group if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  abstract createStudyGroup(groupName: string): Promise<StudyGroup>;

  /**
   * Deletes a study group from the database.
   *
   * @param id ID of the study group to delete
   * @returns promise that resolves if the study group was deleted
   * @throws DbLookupError if the study group to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  abstract deleteStudyGroup(id: number): Promise<void>;

  /**
   * Update a study group in the database.
   *
   * @param studyGroup study group to update with the updated fields
   * @returns promise that resolves with the updated study group if the update was successful
   * @throws DbLookupError if the user to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  abstract updateStudyGroup(studyGroup: StudyGroup): Promise<StudyGroup>;

  /**
   * Gets a flashcard from the database.
   *
   * @param id ID of the flashcard to get
   * @returns promise that resolves with the desired flashcard if found
   * @throws DbLookupError if the flashcard could not be found
   * @throws DbInternalError if the database operation fails
   */
  abstract getFlashcard(id: number): Promise<Flashcard>;

  /**
   * Adds a flashcard to the database.
   *
   * @param question question of the flashcard to create
   * @param answer answer of the flashcard to create
   * @param creatorId ID of the user who created this flashcard
   * @param deckId ID of the deck this flashcard belongs to
   * @returns promise that reoslves with the newly created flashcard if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  abstract createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<Flashcard>;

  /**
   * Delete a flashcard from the database.
   *
   * @param id ID of the flashcard to delete
   * @returns promise that resolves if the flashcard was deleted
   * @throws DbLookupError if the flashcard to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  abstract deleteFlashcard(id: number): Promise<void>;

  /**
   * Update a flashcard in the database.
   *
   * @param flashcard flashcard to update with the updated fields
   * @returns promise that resolves with the updated flashcard if the update was successful
   * @throws DbLookupError if the flashcard to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  abstract updateFlashcard(flashcard: Flashcard): Promise<Flashcard>;

  /**
   * Gets a deck from the database.
   *
   * @param id ID of the deck to get
   * @returns promise that resolves with the desired deck if found
   * @throws DbLookupError if the deck could not be found
   * @throws DbInternalError if the database operation fails
   */
  abstract getDeck(id: number): Promise<Deck>;

  /**
   * Adds a deck to the database.
   *
   * @param deckName name of the deck to create
   * @param creatorId ID of the user who created this deck
   * @param groupId ID of the group this deck belongs to
   * @returns promise that resolves with the newly created deck if the creation was successful
   * @throws DbInternalError if the database operation fails
   */
  abstract createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<Deck>;

  /**
   * Delete a deck from the database.
   *
   * @param id ID of the deck to delete
   * @returns promise that resolves if the deck was deleted
   * @throws DbLookupError if the deck to delete could not be found
   * @throws DbInternalError if the delete operation fails
   */
  abstract deleteDeck(id: number): Promise<void>;

  /**
   * Update a deck in our database.
   *
   * @param deck deck to update with the updated fields
   * @returns promise that resolves with the updated deck if the update was successful
   * @throws DbLookupError if the deck to update could not be found
   * @throws DbInternalError if the update operation fails
   */
  abstract updateDeck(deck: Deck): Promise<Deck>;
}
