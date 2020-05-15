import User from "./../../models/user";
import StudyGroup from "./../../models/group";
import Flashcard from "./../../models/flashcard";
import Deck from "./../../models/deck";
/**
 * Abstract class for a database driver.
 * Implementations of database drivers need to implement the functions declared here.
 */
export default abstract class DatabaseDriver {
  abstract setUp(): Promise<void>;
  abstract getUser(id: number): Promise<User>;
  abstract createUser(username: string): Promise<User>;
  abstract deleteUser(id: number): Promise<void>;
  abstract updateUser(user: User): Promise<void>;
  abstract getStudyGroup(id: number): Promise<StudyGroup>;
  abstract createStudyGroup(groupName: string): Promise<StudyGroup>;
  abstract deleteStudyGroup(id: number): Promise<void>;
  abstract updateStudyGroup(studyGroup: StudyGroup): Promise<void>;
  abstract getFlashcard(id: number): Promise<Flashcard>;
  abstract createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<Flashcard>;
  abstract deleteFlashcard(id: number): Promise<void>;
  abstract updateFlashcard(flashcard: Flashcard): Promise<void>;
  abstract getDeck(id: number): Promise<Deck>;
  abstract createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<Deck>;
  abstract deleteDeck(id: number): Promise<void>;
  abstract updateDeck(deck: Deck): Promise<void>;
}
