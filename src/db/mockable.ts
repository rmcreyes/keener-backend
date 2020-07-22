/* eslint-disable @typescript-eslint/no-unused-vars */
import DatabaseFacade from "db/facade";
import User from "models/user";
import StudyGroup from "models/group";
import Flashcard from "models/flashcard";
import Deck from "models/deck";

/**
 * Database facade implementation for stubbing/mocking in unit tests.
 */
export default class MockableDbFacade extends DatabaseFacade {
  public setUp(): Promise<void> {
    return new Promise((resolve) => resolve());
  }
  public getUser(id: number): Promise<User> {
    return new Promise((resolve) => resolve(new User(id, "username")));
  }
  public createUser(username: string): Promise<User> {
    return new Promise((resolve) => resolve(new User(0, username)));
  }
  public deleteUser(id: number): Promise<void> {
    return new Promise((resolve) => resolve());
  }
  public updateUser(user: User): Promise<User> {
    return new Promise((resolve) => resolve(new User(user.id, user.username)));
  }
  public getStudyGroup(id: number): Promise<StudyGroup> {
    return new Promise((resolve) => resolve(new StudyGroup(id, "groupName")));
  }
  public createStudyGroup(groupName: string): Promise<StudyGroup> {
    return new Promise((resolve) => resolve(new StudyGroup(0, groupName)));
  }
  public deleteStudyGroup(id: number): Promise<void> {
    return new Promise((resolve) => resolve());
  }
  public updateStudyGroup(studyGroup: StudyGroup): Promise<StudyGroup> {
    return new Promise((resolve) =>
      resolve(new StudyGroup(studyGroup.id, studyGroup.groupName))
    );
  }
  public getFlashcard(id: number): Promise<Flashcard> {
    return new Promise((resolve) =>
      resolve(new Flashcard(id, "question", "answer", 0, 0))
    );
  }
  public createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<Flashcard> {
    return new Promise((resolve) =>
      resolve(new Flashcard(0, question, answer, creatorId, deckId))
    );
  }
  public deleteFlashcard(id: number): Promise<void> {
    return new Promise((resolve) => resolve());
  }
  public updateFlashcard(flashcard: Flashcard): Promise<Flashcard> {
    return new Promise((resolve) =>
      resolve(
        new Flashcard(
          flashcard.id,
          flashcard.question,
          flashcard.answer,
          flashcard.creatorId,
          flashcard.deckId
        )
      )
    );
  }
  public getDeck(id: number): Promise<Deck> {
    return new Promise((resolve) => resolve(new Deck(id, "deckName", 0, 0)));
  }
  public createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<Deck> {
    return new Promise((resolve) =>
      resolve(new Deck(0, deckName, creatorId, groupId))
    );
  }
  public deleteDeck(id: number): Promise<void> {
    return new Promise((resolve) => resolve());
  }
  public updateDeck(deck: Deck): Promise<Deck> {
    return new Promise((resolve) =>
      resolve(new Deck(deck.id, deck.deckName, deck.creatorId, deck.groupId))
    );
  }
}
