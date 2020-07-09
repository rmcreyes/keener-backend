import DatabaseAdapter from "db/adapter";
import DatabaseDriver from "db/drivers/driver";
import User from "models/user";
import StudyGroup from "models/group";
import Flashcard from "models/flashcard";
import Deck from "models/deck";

let succeedConnection: boolean;
let succeedGetUser: boolean;
let succeedCreateUser: boolean;
let succeedDeleteUser: boolean;
let succeedUpdateUser: boolean;
let succeedGetStudyGroup: boolean;
let succeedCreateStudyGroup: boolean;
let succeedDeleteStudyGroup: boolean;
let succeedUpdateStudyGroup: boolean;
let succeedGetFlashcard: boolean;
let succeedCreateFlashcard: boolean;
let succeedDeleteFlashcard: boolean;
let succeedUpdateFlashcard: boolean;
let succeedGetDeck: boolean;
let succeedCreateDeck: boolean;
let succeedDeleteDeck: boolean;
let succeedUpdateDeck: boolean;

/**
 * Fake implementation of a database driver to test the adapter.
 */
class FakeDriver extends DatabaseDriver {
  constructor() {
    super();
  }

  public setUp(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedConnection) {
        resolve();
      } else {
        reject(new Error());
      }
    });
  }

  public getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      if (succeedGetUser) {
        resolve(new User(id, "username"));
      } else {
        reject(new Error());
      }
    });
  }

  public createUser(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (succeedCreateUser) {
        resolve(new User(0, username));
      } else {
        reject(new Error());
      }
    });
  }

  public deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedDeleteUser) {
        resolve();
      } else {
        reject(new Error(`${id}`));
      }
    });
  }

  public updateUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedUpdateUser) {
        resolve();
      } else {
        reject(new Error(`${user.id}`));
      }
    });
  }

  public getStudyGroup(id: number): Promise<StudyGroup> {
    return new Promise((resolve, reject) => {
      if (succeedGetStudyGroup) {
        resolve(new StudyGroup(id, "groupName"));
      } else {
        reject(new Error());
      }
    });
  }

  public createStudyGroup(groupName: string): Promise<StudyGroup> {
    return new Promise((resolve, reject) => {
      if (succeedCreateStudyGroup) {
        resolve(new StudyGroup(0, groupName));
      } else {
        reject(new Error());
      }
    });
  }

  public deleteStudyGroup(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedDeleteStudyGroup) {
        resolve();
      } else {
        reject(new Error(`${id}`));
      }
    });
  }

  public updateStudyGroup(studyGroup: StudyGroup): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedUpdateStudyGroup) {
        resolve();
      } else {
        reject(new Error(`${studyGroup.id}`));
      }
    });
  }

  public getFlashcard(id: number): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      if (succeedGetFlashcard) {
        resolve(new Flashcard(id, "question", "answer", id, id));
      } else {
        reject(new Error());
      }
    });
  }

  public createFlashcard(
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ): Promise<Flashcard> {
    return new Promise((resolve, reject) => {
      if (succeedCreateFlashcard) {
        resolve(new Flashcard(0, question, answer, creatorId, deckId));
      } else {
        reject(new Error());
      }
    });
  }

  public deleteFlashcard(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedDeleteFlashcard) {
        resolve();
      } else {
        reject(new Error(`${id}`));
      }
    });
  }

  public updateFlashcard(flashcard: Flashcard): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedUpdateFlashcard) {
        resolve();
      } else {
        reject(new Error(`${flashcard.id}`));
      }
    });
  }

  public getDeck(id: number): Promise<Deck> {
    return new Promise((resolve, reject) => {
      if (succeedGetDeck) {
        resolve(new Deck(id, "deckName", id, id));
      } else {
        reject(new Error());
      }
    });
  }

  public createDeck(
    deckName: string,
    creatorId: number,
    groupId: number
  ): Promise<Deck> {
    return new Promise((resolve, reject) => {
      if (succeedCreateDeck) {
        resolve(new Deck(0, deckName, creatorId, groupId));
      } else {
        reject(new Error());
      }
    });
  }

  public deleteDeck(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedDeleteDeck) {
        resolve();
      } else {
        reject(new Error(`${id}`));
      }
    });
  }

  public updateDeck(deck: Deck): Promise<void> {
    return new Promise((resolve, reject) => {
      if (succeedUpdateDeck) {
        resolve();
      } else {
        reject(new Error(`${deck.id}`));
      }
    });
  }
}

let adapter: DatabaseAdapter;

/**
 * Unit test suite for the database adapter.
 */
beforeEach(() => (adapter = new DatabaseAdapter(new FakeDriver())));

it("should be able to detect a driver's successful connection", async () => {
  succeedConnection = true;
  let passed: boolean;
  try {
    await adapter.setUp();
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to detect a driver's unsuccessful connection", async () => {
  succeedConnection = false;
  let passed: boolean;
  try {
    await adapter.setUp();
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully retrieve a user via ID with its driver", async () => {
  succeedGetUser = true;
  let passed: boolean;
  try {
    await adapter.getUser(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a user is not found via ID", async () => {
  succeedGetUser = false;
  let passed: boolean;
  try {
    await adapter.getUser(4);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully create a user via ID with its driver", async () => {
  succeedCreateUser = true;
  let passed: boolean;
  try {
    await adapter.createUser("username");
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a user is not created", async () => {
  succeedCreateUser = false;
  let passed: boolean;
  try {
    await adapter.createUser("username");
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully delete a user via ID with its driver", async () => {
  succeedDeleteUser = true;
  let passed: boolean;
  try {
    await adapter.deleteUser(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a user is not deleted", async () => {
  succeedDeleteUser = false;
  let passed: boolean;
  try {
    await adapter.deleteUser(0);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully update a user via ID with its driver", async () => {
  succeedUpdateUser = true;
  let passed: boolean;
  try {
    await adapter.updateUser(new User(0, "username"));
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a user is not updated", async () => {
  succeedUpdateUser = false;
  let passed: boolean;
  try {
    await adapter.updateUser(new User(0, "username"));
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully retrieve a study group via ID with its driver", async () => {
  succeedGetStudyGroup = true;
  let passed: boolean;
  try {
    await adapter.getStudyGroup(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a study group is not found via ID", async () => {
  succeedGetStudyGroup = false;
  let passed: boolean;
  try {
    await adapter.getStudyGroup(4);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully create a study group via ID with its driver", async () => {
  succeedCreateStudyGroup = true;
  let passed: boolean;
  try {
    await adapter.createStudyGroup("groupName");
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a study group is not created", async () => {
  succeedCreateStudyGroup = false;
  let passed: boolean;
  try {
    await adapter.createStudyGroup("groupName");
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully delete a study group via ID with its driver", async () => {
  succeedDeleteStudyGroup = true;
  let passed: boolean;
  try {
    await adapter.deleteStudyGroup(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a study group is not deleted", async () => {
  succeedDeleteStudyGroup = false;
  let passed: boolean;
  try {
    await adapter.deleteStudyGroup(0);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully update a study group via ID with its driver", async () => {
  succeedUpdateStudyGroup = true;
  let passed: boolean;
  try {
    await adapter.updateStudyGroup(new StudyGroup(0, "groupName"));
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a study group is not updated", async () => {
  succeedUpdateStudyGroup = false;
  let passed: boolean;
  try {
    await adapter.updateStudyGroup(new StudyGroup(0, "groupName"));
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully retrieve a flashcard via ID with its driver", async () => {
  succeedGetFlashcard = true;
  let passed: boolean;
  try {
    await adapter.getFlashcard(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a flashcard is not found via ID", async () => {
  succeedGetFlashcard = false;
  let passed: boolean;
  try {
    await adapter.getFlashcard(4);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully create a flashcard via ID with its driver", async () => {
  succeedCreateFlashcard = true;
  let passed: boolean;
  try {
    await adapter.createFlashcard("question", "answer", 0, 0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a flashcard is not created", async () => {
  succeedCreateFlashcard = false;
  let passed: boolean;
  try {
    await adapter.createFlashcard("question", "answer", 0, 0);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully delete a flashcard via ID with its driver", async () => {
  succeedDeleteFlashcard = true;
  let passed: boolean;
  try {
    await adapter.deleteFlashcard(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a flashcard is not deleted", async () => {
  succeedDeleteFlashcard = false;
  let passed: boolean;
  try {
    await adapter.deleteFlashcard(0);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully update a flashcard via ID with its driver", async () => {
  succeedUpdateFlashcard = true;
  let passed: boolean;
  try {
    await adapter.updateFlashcard(new Flashcard(0, "question", "answer", 0, 0));
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a flashcard is not updated", async () => {
  succeedUpdateFlashcard = false;
  let passed: boolean;
  try {
    await adapter.updateFlashcard(new Flashcard(0, "question", "answer", 0, 0));
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully retrieve a deck via ID with its driver", async () => {
  succeedGetDeck = true;
  let passed: boolean;
  try {
    await adapter.getDeck(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a deck is not found via ID", async () => {
  succeedGetDeck = false;
  let passed: boolean;
  try {
    await adapter.getDeck(4);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully create a deck via ID with its driver", async () => {
  succeedCreateDeck = true;
  let passed: boolean;
  try {
    await adapter.createDeck("deckName", 0, 0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a deck is not created", async () => {
  succeedCreateDeck = false;
  let passed: boolean;
  try {
    await adapter.createDeck("deckName", 0, 0);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully delete a deck via ID with its driver", async () => {
  succeedDeleteDeck = true;
  let passed: boolean;
  try {
    await adapter.deleteDeck(0);
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a deck is not deleted", async () => {
  succeedDeleteDeck = false;
  let passed: boolean;
  try {
    await adapter.deleteDeck(0);
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});

it("should be able to successfully update a deck via ID with its driver", async () => {
  succeedUpdateDeck = true;
  let passed: boolean;
  try {
    await adapter.updateDeck(new Deck(0, "deckName", 0, 0));
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should be able to reject the driver's promise if a deck is not updated", async () => {
  succeedUpdateDeck = false;
  let passed: boolean;
  try {
    await adapter.updateDeck(new Deck(0, "deckName", 0, 0));
    passed = false;
  } catch (err) {
    passed = true;
  }
  expect(passed).toBeTruthy();
});
