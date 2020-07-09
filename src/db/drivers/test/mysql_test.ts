import { Sequelize, Model } from "sequelize";
import MySqlDriver from "db/drivers/mysql";
import { DbLookupError, DbConnectionError, DbInternalError } from "db/errors";
import User from "models/user";
import StudyGroup from "models/group";
import Flashcard from "models/flashcard";
import Deck from "models/deck";

// mocking Sequelize's authenticate() function
let successfullyAuthenticate: boolean;

const mockAuthenticate = jest.fn().mockImplementation(() => {
  return new Promise((resolve, reject) => {
    if (successfullyAuthenticate) resolve();
    else reject("Mock authentication failed");
  });
});

// mocking Sequelize's sync() function
let successfullySync: boolean;

const mockSync = jest.fn().mockImplementation(() => {
  return new Promise((resolve, reject) => {
    if (successfullySync) resolve();
    else reject("Mock sync failed");
  });
});

// mocking our tables

let passUserModelDestroy: boolean;
let passUserModelSave: boolean;
class UserTableInfo {
  id: number;
  username: string;
  users: UserTableInfo[];

  constructor(id: number, username: string, users: UserTableInfo[]) {
    this.id = id;
    this.username = username;
    this.users = users;
  }

  public destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passUserModelDestroy) {
        for (let i = 0; i < this.users.length; i++) {
          const instance = this.users[i];
          if (instance.id === this.id) {
            this.users.splice(i, 1);
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model destroy failed");
      }
    });
  }

  public save(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passUserModelSave) {
        for (let i = 0; i < this.users.length; i++) {
          const instance = this.users[i];
          if (instance.id === this.id) {
            instance.username = this.username;
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model save failed");
      }
    });
  }
}

let passStudyGroupModelDestroy: boolean;
let passStudyGroupModelSave: boolean;
class StudyGroupTableInfo {
  id: number;
  groupName: string;
  studyGroups: StudyGroupTableInfo[];

  constructor(
    id: number,
    groupName: string,
    studyGroups: StudyGroupTableInfo[]
  ) {
    this.id = id;
    this.groupName = groupName;
    this.studyGroups = studyGroups;
  }

  public destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passStudyGroupModelDestroy) {
        for (let i = 0; i < this.studyGroups.length; i++) {
          const instance = this.studyGroups[i];
          if (instance.id === this.id) {
            this.studyGroups.splice(i, 1);
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model destroy failed");
      }
    });
  }

  public save(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passStudyGroupModelSave) {
        for (let i = 0; i < this.studyGroups.length; i++) {
          const instance = this.studyGroups[i];
          if (instance.id === this.id) {
            instance.groupName = this.groupName;
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model save failed");
      }
    });
  }
}

let passFlashcardModelDestroy: boolean;
let passFlashcardModelSave: boolean;
class FlashcardTableInfo {
  id: number;
  question: string;
  answer: string;
  creatorId: number;
  deckId: number;
  flashcards: FlashcardTableInfo[];

  constructor(
    id: number,
    question: string,
    answer: string,
    creatorId: number,
    deckId: number,
    flashcards: FlashcardTableInfo[]
  ) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.creatorId = creatorId;
    this.deckId = deckId;
    this.flashcards = flashcards;
  }

  public destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passFlashcardModelDestroy) {
        for (let i = 0; i < this.flashcards.length; i++) {
          const instance = this.flashcards[i];
          if (instance.id === this.id) {
            this.flashcards.splice(i, 1);
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model destroy failed");
      }
    });
  }

  public save(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passFlashcardModelSave) {
        for (let i = 0; i < this.flashcards.length; i++) {
          const instance = this.flashcards[i];
          if (instance.id === this.id) {
            instance.question = this.question;
            instance.answer = this.answer;
            instance.creatorId = this.creatorId;
            instance.deckId = this.deckId;
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model save failed");
      }
    });
  }
}

let passDeckModelDestroy: boolean;
let passDeckModelSave: boolean;
class DeckTableInfo {
  id: number;
  deckName: string;
  creatorId: number;
  groupId: number;
  decks: DeckTableInfo[];

  constructor(
    id: number,
    deckName: string,
    creatorId: number,
    groupId: number,
    decks: DeckTableInfo[]
  ) {
    this.id = id;
    this.deckName = deckName;
    this.creatorId = creatorId;
    this.groupId = groupId;
    this.decks = decks;
  }

  public destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passDeckModelDestroy) {
        for (let i = 0; i < this.decks.length; i++) {
          const instance = this.decks[i];
          if (instance.id === this.id) {
            this.decks.splice(i, 1);
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model destroy failed");
      }
    });
  }

  public save(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (passDeckModelSave) {
        for (let i = 0; i < this.decks.length; i++) {
          const instance = this.decks[i];
          if (instance.id === this.id) {
            instance.deckName = this.deckName;
            instance.creatorId = this.creatorId;
            instance.groupId = this.groupId;
            resolve();
          }
        }
        reject("Mock model instance not found");
      } else {
        reject("Mock model save failed");
      }
    });
  }
}

let users: UserTableInfo[];
let studyGroups: StudyGroupTableInfo[];
let flashcards: FlashcardTableInfo[];
let decks: DeckTableInfo[];

class MockSequelizeUserModel extends Model {}
class MockSequelizeStudyGroupModel extends Model {}
class MockSequelizeFlashcardModel extends Model {}
class MockSequelizeDeckModel extends Model {}

let passUserFindByPk: boolean;

const mockUserFindByPk = jest.fn().mockImplementation((pk: number) => {
  return new Promise((resolve, reject) => {
    if (passUserFindByPk) {
      for (const user of users)
        if (user.id === pk)
          resolve(new UserTableInfo(user.id, user.username, users));
      resolve(null);
    } else {
      reject("Mock user find failed");
    }
  });
});

let passUserCreate: boolean;
let createdUserNum: number;

const mockUserCreate = jest.fn().mockImplementation((object) => {
  return new Promise((resolve, reject) => {
    if (passUserCreate) {
      const newUser = new UserTableInfo(createdUserNum, object.username, users);
      createdUserNum++;
      users.push(newUser);
      resolve(newUser);
    } else {
      reject("Mock user creation failed");
    }
  });
});

let passStudyGroupFindByPk: boolean;

const mockStudyGroupFindByPk = jest.fn().mockImplementation((pk: number) => {
  return new Promise((resolve, reject) => {
    if (passStudyGroupFindByPk) {
      for (const studyGroup of studyGroups)
        if (studyGroup.id === pk)
          resolve(
            new StudyGroupTableInfo(
              studyGroup.id,
              studyGroup.groupName,
              studyGroups
            )
          );
      resolve(null);
    } else {
      reject("Mock study group find failed");
    }
  });
});

let passStudyGroupCreate: boolean;
let createdStudyGroupNum: number;

const mockStudyGroupCreate = jest.fn().mockImplementation((object) => {
  return new Promise((resolve, reject) => {
    if (passStudyGroupCreate) {
      const newStudyGroup = new StudyGroupTableInfo(
        createdStudyGroupNum,
        object.groupName,
        studyGroups
      );
      createdStudyGroupNum++;
      studyGroups.push(newStudyGroup);
      resolve(newStudyGroup);
    } else {
      reject("Mock study group creation failed");
    }
  });
});

let passFlashcardFindByPk: boolean;

const mockFlashcardFindByPk = jest.fn().mockImplementation((pk: number) => {
  return new Promise((resolve, reject) => {
    if (passFlashcardFindByPk) {
      for (const flashcard of flashcards)
        if (flashcard.id === pk)
          resolve(
            new FlashcardTableInfo(
              flashcard.id,
              flashcard.question,
              flashcard.answer,
              flashcard.creatorId,
              flashcard.deckId,
              flashcards
            )
          );
      resolve(null);
    } else {
      reject("Mock flashcard find failed");
    }
  });
});

let passFlashcardCreate: boolean;
let createdFlashcardNum: number;

const mockFlashcardCreate = jest.fn().mockImplementation((object) => {
  return new Promise((resolve, reject) => {
    if (passFlashcardCreate) {
      const newFlashcard = new FlashcardTableInfo(
        createdFlashcardNum,
        object.question,
        object.answer,
        object.creatorId,
        object.deckId,
        flashcards
      );
      createdFlashcardNum++;
      flashcards.push(newFlashcard);
      resolve(newFlashcard);
    } else {
      reject("Mock flashcard creation failed");
    }
  });
});

let passDeckFindByPk: boolean;

const mockDeckFindByPk = jest.fn().mockImplementation((pk: number) => {
  return new Promise((resolve, reject) => {
    if (passDeckFindByPk) {
      for (const deck of decks)
        if (deck.id === pk)
          resolve(
            new DeckTableInfo(
              deck.id,
              deck.deckName,
              deck.creatorId,
              deck.groupId,
              decks
            )
          );
      resolve(null);
    } else {
      reject("Mock deck find failed");
    }
  });
});

let passDeckCreate: boolean;
let createdDeckNum: number;

const mockDeckCreate = jest.fn().mockImplementation((object) => {
  return new Promise((resolve, reject) => {
    if (passDeckCreate) {
      const newDeck = new DeckTableInfo(
        createdDeckNum,
        object.deckName,
        object.creatorId,
        object.groupId,
        decks
      );
      createdDeckNum++;
      decks.push(newDeck);
      resolve(newDeck);
    } else {
      reject("Mock deck creation failed");
    }
  });
});

MockSequelizeUserModel.findByPk = mockUserFindByPk;
MockSequelizeUserModel.create = mockUserCreate;
MockSequelizeStudyGroupModel.findByPk = mockStudyGroupFindByPk;
MockSequelizeStudyGroupModel.create = mockStudyGroupCreate;
MockSequelizeFlashcardModel.findByPk = mockFlashcardFindByPk;
MockSequelizeFlashcardModel.create = mockFlashcardCreate;
MockSequelizeDeckModel.findByPk = mockDeckFindByPk;
MockSequelizeDeckModel.create = mockDeckCreate;

const mockDefine = jest.fn().mockImplementation((modelName) => {
  if (modelName === "User") return MockSequelizeUserModel;
  else if (modelName === "StudyGroup") return MockSequelizeStudyGroupModel;
  else if (modelName === "Flashcard") return MockSequelizeFlashcardModel;
  else return MockSequelizeDeckModel;
});

Sequelize.prototype.authenticate = mockAuthenticate;
Sequelize.prototype.sync = mockSync;
Sequelize.prototype.define = mockDefine;

let mySql: MySqlDriver;

beforeEach(async () => {
  // reset mock functions
  mockUserFindByPk.mockClear();
  mockUserCreate.mockClear();
  mockStudyGroupFindByPk.mockClear();
  mockStudyGroupCreate.mockClear();
  mockFlashcardFindByPk.mockClear();
  mockFlashcardCreate.mockClear();
  mockDeckFindByPk.mockClear();
  mockDeckCreate.mockClear();
  mockAuthenticate.mockClear();
  mockSync.mockClear();
  mockDefine.mockClear();

  // reset mock databases
  users = [];
  studyGroups = [];
  flashcards = [];
  decks = [];
  createdUserNum = 0;
  createdStudyGroupNum = 0;
  createdFlashcardNum = 0;
  createdDeckNum = 0;

  // redefine mySql structure
  mySql = new MySqlDriver("fakedb", "fakeuser", "fakepass", "fakehost");
});

it("should throw DbConnectionError if it cannot successfully authenticate with the database", async () => {
  successfullyAuthenticate = false;
  successfullySync = true;
  let passed: boolean;
  try {
    await mySql.setUp();
    passed = false;
  } catch (err) {
    if (err instanceof DbConnectionError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockAuthenticate.mock.calls.length).toEqual(1);
  expect(mockSync.mock.calls.length).toEqual(0);
});

it("should throw DbConnectionError if it cannot successfully synchronize with the database", async () => {
  successfullyAuthenticate = true;
  successfullySync = false;
  let passed: boolean;
  try {
    await mySql.setUp();
    passed = false;
  } catch (err) {
    if (err instanceof DbConnectionError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockAuthenticate.mock.calls.length).toEqual(1);
  expect(mockSync.mock.calls.length).toEqual(1);
});

it("should resolve on set up if successfully authenticates and synchronizes with the database", async () => {
  successfullyAuthenticate = true;
  successfullySync = true;
  let passed: boolean;
  try {
    await mySql.setUp();
    passed = true;
  } catch (err) {
    passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockAuthenticate.mock.calls.length).toEqual(1);
  expect(mockSync.mock.calls.length).toEqual(1);
});

it("should throw DbLookupError if it attempts to get a user that does not exist", async () => {
  passUserFindByPk = true;
  let passed: boolean;
  try {
    await mySql.getUser(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockUserFindByPk.mock.calls.length).toEqual(1);
  expect(mockUserFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError if a failure occurs when attempting to get a user", async () => {
  passUserFindByPk = false;
  let passed: boolean;
  try {
    await mySql.getUser(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockUserFindByPk.mock.calls.length).toEqual(1);
  expect(mockUserFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError a failure happens when creating a user", async () => {
  passUserCreate = false;
  let passed: boolean;
  try {
    await mySql.createUser("someusername");
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockUserCreate.mock.calls.length).toEqual(1);
});

it("should be able to properly create a user in the database", async () => {
  passUserCreate = true;
  let createdUser: User;
  try {
    createdUser = await mySql.createUser("someusername");
  } catch (err) {
    expect(false).toBeTruthy();
    createdUser = new User(99, "failed");
  }
  expect(createdUser.username).toEqual("someusername");
  expect(users.length).toEqual(1);
  expect(users[0].username).toEqual(createdUser.username);
  expect(mockUserCreate.mock.calls.length).toEqual(1);
});

it("should be able to get a user that exists in the database", async () => {
  passUserFindByPk = true;
  passUserCreate = true;
  let createdUser: User;
  let gottenUser: User;

  try {
    createdUser = await mySql.createUser("someusername");
  } catch (err) {
    expect(false).toBeTruthy();
    createdUser = new User(99, "failed");
  }

  try {
    gottenUser = await mySql.getUser(createdUser.id);
  } catch (err) {
    expect(false).toBeTruthy();
    gottenUser = new User(99, "failed");
  }

  expect(gottenUser.id).toEqual(createdUser.id);
  expect(gottenUser.username).toEqual(createdUser.username);
  expect(mockUserFindByPk.mock.calls.length).toEqual(1);
  expect(mockUserFindByPk.mock.calls[0][0]).toEqual(createdUser.id);
});

it("should throw DbInternalError if a failure happens when getting the user to delete", async () => {
  passUserFindByPk = false;
  let passed: boolean;

  try {
    await mySql.deleteUser(0);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when deleting a user", async () => {
  passUserFindByPk = true;
  passUserCreate = true;
  passUserModelDestroy = false;
  let passed: boolean;
  let createdUser: User;

  try {
    createdUser = await mySql.createUser("someusername");
  } catch (err) {
    expect(false).toBeTruthy();
    createdUser = new User(99, "failed");
  }

  try {
    await mySql.deleteUser(createdUser.id);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to delete a user that does not exist", async () => {
  passUserFindByPk = true;
  let passed: boolean;
  try {
    await mySql.deleteUser(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully deleting a user", async () => {
  passUserFindByPk = true;
  passUserCreate = true;
  passUserModelDestroy = true;
  let createdUser: User;
  let passed: boolean;

  try {
    createdUser = await mySql.createUser("someusername");
  } catch (err) {
    expect(false).toBeTruthy();
    createdUser = new User(99, "failed");
  }

  try {
    await mySql.deleteUser(createdUser.id);
    passed = true;
  } catch (err) {
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(users.length).toEqual(0);
});

it("should throw DbInternalError if a failure happens when getting the user to update", async () => {
  passUserFindByPk = false;
  let passed: boolean;
  const updateUser = new User(0, "username");

  try {
    await mySql.updateUser(updateUser);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when updating a user", async () => {
  passUserFindByPk = true;
  passUserCreate = true;
  passUserModelSave = false;
  let passed: boolean;
  let createdUser: User;

  try {
    createdUser = await mySql.createUser("username");
  } catch (err) {
    expect(false).toBeTruthy();
    createdUser = new User(99, "failed");
  }

  try {
    await mySql.updateUser(createdUser);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to update a user that does not exist", async () => {
  passUserFindByPk = true;
  let passed: boolean;
  const updateUser = new User(0, "username");
  try {
    await mySql.updateUser(updateUser);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully updating a user", async () => {
  passUserFindByPk = true;
  passUserCreate = true;
  passUserModelSave = true;
  let createdUser: User;
  let gottenUser: User;
  let passed: boolean;

  try {
    createdUser = await mySql.createUser("username");
  } catch (err) {
    expect(false).toBeTruthy();
    createdUser = new User(99, "failed");
  }

  createdUser.username = "otherUsername";

  try {
    await mySql.updateUser(createdUser);
  } catch (err) {
    expect(false).toBeTruthy();
  }

  try {
    gottenUser = await mySql.getUser(createdUser.id);
    passed = true;
  } catch (err) {
    gottenUser = new User(99, "failed");
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(gottenUser.username).toEqual("otherUsername");
});

it("should throw DbLookupError if it attempts to get a study group that does not exist", async () => {
  passStudyGroupFindByPk = true;
  let passed: boolean;
  try {
    await mySql.getStudyGroup(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockStudyGroupFindByPk.mock.calls.length).toEqual(1);
  expect(mockStudyGroupFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError if a failure happens when attempting to get a study group", async () => {
  passStudyGroupFindByPk = false;
  let passed: boolean;
  try {
    await mySql.getStudyGroup(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockStudyGroupFindByPk.mock.calls.length).toEqual(1);
  expect(mockStudyGroupFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError if a failure happens when creating a study group", async () => {
  passStudyGroupCreate = false;
  let passed: boolean;
  try {
    await mySql.createStudyGroup("somegroupname");
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockStudyGroupCreate.mock.calls.length).toEqual(1);
});

it("should be able to properly create a study group in the database", async () => {
  passStudyGroupCreate = true;
  let createdStudyGroup: StudyGroup;
  try {
    createdStudyGroup = await mySql.createStudyGroup("somegroupname");
  } catch (err) {
    expect(false).toBeTruthy();
    createdStudyGroup = new StudyGroup(99, "failed");
  }
  expect(createdStudyGroup.groupName).toEqual("somegroupname");
  expect(studyGroups.length).toEqual(1);
  expect(studyGroups[0].groupName).toEqual(createdStudyGroup.groupName);
  expect(mockStudyGroupCreate.mock.calls.length).toEqual(1);
});

it("should be able to get a study group that exists in the database", async () => {
  passStudyGroupFindByPk = true;
  passStudyGroupCreate = true;
  let createdStudyGroup: StudyGroup;
  let gottenStudyGroup: StudyGroup;

  try {
    createdStudyGroup = await mySql.createStudyGroup("somegroupname");
  } catch (err) {
    expect(false).toBeTruthy();
    createdStudyGroup = new StudyGroup(99, "failed");
  }

  try {
    gottenStudyGroup = await mySql.getStudyGroup(createdStudyGroup.id);
  } catch (err) {
    expect(false).toBeTruthy();
    gottenStudyGroup = new StudyGroup(99, "failed");
  }

  expect(gottenStudyGroup.id).toEqual(createdStudyGroup.id);
  expect(gottenStudyGroup.groupName).toEqual(createdStudyGroup.groupName);
  expect(mockStudyGroupFindByPk.mock.calls.length).toEqual(1);
  expect(mockStudyGroupFindByPk.mock.calls[0][0]).toEqual(createdStudyGroup.id);
});

it("should throw DbInternalError if a failure happens when getting the study group to delete", async () => {
  passStudyGroupFindByPk = false;
  let passed: boolean;

  try {
    await mySql.deleteStudyGroup(0);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when deleting a study group", async () => {
  passStudyGroupFindByPk = true;
  passStudyGroupCreate = true;
  passStudyGroupModelDestroy = false;
  let passed: boolean;
  let createdStudyGroup: StudyGroup;

  try {
    createdStudyGroup = await mySql.createStudyGroup("somegroupname");
  } catch (err) {
    expect(false).toBeTruthy();
    createdStudyGroup = new StudyGroup(99, "failed");
  }

  try {
    await mySql.deleteStudyGroup(createdStudyGroup.id);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to delete a study group that does not exist", async () => {
  passStudyGroupFindByPk = true;
  let passed: boolean;
  try {
    await mySql.deleteStudyGroup(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully deleting a study group", async () => {
  passStudyGroupFindByPk = true;
  passStudyGroupCreate = true;
  passStudyGroupModelDestroy = true;
  let createdStudyGroup: StudyGroup;
  let passed: boolean;

  try {
    createdStudyGroup = await mySql.createStudyGroup("somegroupname");
  } catch (err) {
    expect(false).toBeTruthy();
    createdStudyGroup = new StudyGroup(99, "failed");
  }

  try {
    await mySql.deleteStudyGroup(createdStudyGroup.id);
    passed = true;
  } catch (err) {
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(studyGroups.length).toEqual(0);
});

it("should throw DbInternalError if a failure happens when getting the study group to update", async () => {
  passStudyGroupFindByPk = false;
  let passed: boolean;
  const updateStudyGroup = new StudyGroup(0, "groupName");

  try {
    await mySql.updateStudyGroup(updateStudyGroup);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when updating a study group", async () => {
  passStudyGroupFindByPk = true;
  passStudyGroupCreate = true;
  passStudyGroupModelSave = false;
  let passed: boolean;
  let createdStudyGroup: StudyGroup;

  try {
    createdStudyGroup = await mySql.createStudyGroup("groupName");
  } catch (err) {
    expect(false).toBeTruthy();
    createdStudyGroup = new StudyGroup(99, "failed");
  }

  try {
    await mySql.updateStudyGroup(createdStudyGroup);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to update a study group that does not exist", async () => {
  passStudyGroupFindByPk = true;
  let passed: boolean;
  const updateStudyGroup = new StudyGroup(0, "groupname");
  try {
    await mySql.updateStudyGroup(updateStudyGroup);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully updating a study group", async () => {
  passStudyGroupFindByPk = true;
  passStudyGroupCreate = true;
  passStudyGroupModelSave = true;
  let createdStudyGroup: StudyGroup;
  let gottenStudyGroup: StudyGroup;
  let passed: boolean;

  try {
    createdStudyGroup = await mySql.createStudyGroup("groupname");
  } catch (err) {
    expect(false).toBeTruthy();
    createdStudyGroup = new StudyGroup(99, "failed");
  }

  createdStudyGroup.groupName = "otherGroupname";

  try {
    await mySql.updateStudyGroup(createdStudyGroup);
  } catch (err) {
    expect(false).toBeTruthy();
  }

  try {
    gottenStudyGroup = await mySql.getStudyGroup(createdStudyGroup.id);
    passed = true;
  } catch (err) {
    gottenStudyGroup = new StudyGroup(99, "failed");
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(gottenStudyGroup.groupName).toEqual("otherGroupname");
});

it("should throw DbLookupError if it attempts to get a flashcard that does not exist", async () => {
  passFlashcardFindByPk = true;
  let passed: boolean;
  try {
    await mySql.getFlashcard(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockFlashcardFindByPk.mock.calls.length).toEqual(1);
  expect(mockFlashcardFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError if a failure occurs when attempting to get a flashcard", async () => {
  passFlashcardFindByPk = false;
  let passed: boolean;
  try {
    await mySql.getFlashcard(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockFlashcardFindByPk.mock.calls.length).toEqual(1);
  expect(mockFlashcardFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError a failure happens when creating a flashcard", async () => {
  passFlashcardCreate = false;
  let passed: boolean;
  try {
    await mySql.createFlashcard("somequestion", "someanswer", 0, 0);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockFlashcardCreate.mock.calls.length).toEqual(1);
});

it("should be able to properly create a flashcard in the database", async () => {
  passFlashcardCreate = true;
  let createdFlashcard: Flashcard;
  try {
    createdFlashcard = await mySql.createFlashcard(
      "somequestion",
      "someanswer",
      0,
      0
    );
  } catch (err) {
    expect(false).toBeTruthy();
    createdFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }
  expect(createdFlashcard.question).toEqual("somequestion");
  expect(createdFlashcard.answer).toEqual("someanswer");
  expect(createdFlashcard.creatorId).toEqual(0);
  expect(createdFlashcard.deckId).toEqual(0);
  expect(flashcards.length).toEqual(1);
  expect(flashcards[0].question).toEqual(createdFlashcard.question);
  expect(mockFlashcardCreate.mock.calls.length).toEqual(1);
});

it("should be able to get a flashcard that exists in the database", async () => {
  passFlashcardFindByPk = true;
  passFlashcardCreate = true;
  let createdFlashcard: Flashcard;
  let gottenFlashcard: Flashcard;

  try {
    createdFlashcard = await mySql.createFlashcard(
      "somequestion",
      "someanswer",
      0,
      0
    );
  } catch (err) {
    expect(false).toBeTruthy();
    createdFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }

  try {
    gottenFlashcard = await mySql.getFlashcard(createdFlashcard.id);
  } catch (err) {
    expect(false).toBeTruthy();
    gottenFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }

  expect(gottenFlashcard.id).toEqual(createdFlashcard.id);
  expect(gottenFlashcard.question).toEqual(createdFlashcard.question);
  expect(gottenFlashcard.answer).toEqual(createdFlashcard.answer);
  expect(gottenFlashcard.creatorId).toEqual(createdFlashcard.creatorId);
  expect(gottenFlashcard.deckId).toEqual(createdFlashcard.deckId);
  expect(mockFlashcardFindByPk.mock.calls.length).toEqual(1);
  expect(mockFlashcardFindByPk.mock.calls[0][0]).toEqual(createdFlashcard.id);
});

it("should throw DbInternalError if a failure happens when getting the flashcard to delete", async () => {
  passFlashcardFindByPk = false;
  let passed: boolean;

  try {
    await mySql.deleteFlashcard(0);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when deleting a flashcard", async () => {
  passFlashcardFindByPk = true;
  passFlashcardCreate = true;
  passFlashcardModelDestroy = false;
  let passed: boolean;
  let createdFlashcard: Flashcard;

  try {
    createdFlashcard = await mySql.createFlashcard(
      "somequestion",
      "someanswer",
      0,
      0
    );
  } catch (err) {
    expect(false).toBeTruthy();
    createdFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }

  try {
    await mySql.deleteFlashcard(createdFlashcard.id);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to delete a flashcard that does not exist", async () => {
  passFlashcardFindByPk = true;
  let passed: boolean;
  try {
    await mySql.deleteFlashcard(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully deleting a flashcard", async () => {
  passFlashcardFindByPk = true;
  passFlashcardCreate = true;
  passFlashcardModelDestroy = true;
  let createdFlashcard: Flashcard;
  let passed: boolean;

  try {
    createdFlashcard = await mySql.createFlashcard(
      "somequestion",
      "someanswer",
      0,
      0
    );
  } catch (err) {
    expect(false).toBeTruthy();
    createdFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }

  try {
    await mySql.deleteFlashcard(createdFlashcard.id);
    passed = true;
  } catch (err) {
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(flashcards.length).toEqual(0);
});

it("should throw DbInternalError if a failure happens when getting the flashcard to update", async () => {
  passFlashcardFindByPk = false;
  let passed: boolean;
  const updateFlashcard = new Flashcard(0, "question", "answer", 0, 0);

  try {
    await mySql.updateFlashcard(updateFlashcard);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when updating a flashcard", async () => {
  passFlashcardFindByPk = true;
  passFlashcardCreate = true;
  passFlashcardModelSave = false;
  let passed: boolean;
  let createdFlashcard: Flashcard;

  try {
    createdFlashcard = await mySql.createFlashcard(
      "somequestion",
      "someanswer",
      0,
      0
    );
  } catch (err) {
    expect(false).toBeTruthy();
    createdFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }

  try {
    await mySql.updateFlashcard(createdFlashcard);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to update a flashcard that does not exist", async () => {
  passFlashcardFindByPk = true;
  let passed: boolean;
  const updateFlashcard = new Flashcard(0, "question", "answer", 0, 0);
  try {
    await mySql.updateFlashcard(updateFlashcard);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully updating a flashcard", async () => {
  passFlashcardFindByPk = true;
  passFlashcardCreate = true;
  passFlashcardModelSave = true;
  let createdFlashcard: Flashcard;
  let gottenFlashcard: Flashcard;
  let passed: boolean;

  try {
    createdFlashcard = await mySql.createFlashcard(
      "somequestion",
      "someanswer",
      0,
      0
    );
  } catch (err) {
    expect(false).toBeTruthy();
    createdFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
  }

  createdFlashcard.answer = "otheranswer";

  try {
    await mySql.updateFlashcard(createdFlashcard);
  } catch (err) {
    expect(false).toBeTruthy();
  }

  try {
    gottenFlashcard = await mySql.getFlashcard(createdFlashcard.id);
    passed = true;
  } catch (err) {
    gottenFlashcard = new Flashcard(99, "failed", "failed", 99, 99);
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(gottenFlashcard.answer).toEqual("otheranswer");
});

it("should throw DbLookupError if it attempts to get a deck that does not exist", async () => {
  passDeckFindByPk = true;
  let passed: boolean;
  try {
    await mySql.getDeck(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockDeckFindByPk.mock.calls.length).toEqual(1);
  expect(mockDeckFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError if a failure occurs when attempting to get a deck", async () => {
  passDeckFindByPk = false;
  let passed: boolean;
  try {
    await mySql.getDeck(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockDeckFindByPk.mock.calls.length).toEqual(1);
  expect(mockDeckFindByPk.mock.calls[0][0]).toEqual(1);
});

it("should throw DbInternalError a failure happens when creating a deck", async () => {
  passDeckCreate = false;
  let passed: boolean;
  try {
    await mySql.createDeck("somedeckname", 0, 0);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  expect(mockDeckCreate.mock.calls.length).toEqual(1);
});

it("should be able to properly create a deck in the database", async () => {
  passDeckCreate = true;
  let createdDeck: Deck;
  try {
    createdDeck = await mySql.createDeck("somedeckname", 0, 0);
  } catch (err) {
    expect(false).toBeTruthy();
    createdDeck = new Deck(99, "failed", 99, 99);
  }
  expect(createdDeck.deckName).toEqual("somedeckname");
  expect(createdDeck.creatorId).toEqual(0);
  expect(createdDeck.groupId).toEqual(0);
  expect(decks.length).toEqual(1);
  expect(decks[0].deckName).toEqual(createdDeck.deckName);
  expect(mockDeckCreate.mock.calls.length).toEqual(1);
});

it("should be able to get a deck that exists in the database", async () => {
  passDeckFindByPk = true;
  passDeckCreate = true;
  let createdDeck: Deck;
  let gottenDeck: Deck;

  try {
    createdDeck = await mySql.createDeck("somedeckname", 0, 0);
  } catch (err) {
    expect(false).toBeTruthy();
    createdDeck = new Deck(99, "failed", 99, 99);
  }

  try {
    gottenDeck = await mySql.getDeck(createdDeck.id);
  } catch (err) {
    expect(false).toBeTruthy();
    gottenDeck = new Deck(99, "failed", 99, 99);
  }

  expect(gottenDeck.id).toEqual(createdDeck.id);
  expect(gottenDeck.deckName).toEqual(createdDeck.deckName);
  expect(gottenDeck.creatorId).toEqual(createdDeck.creatorId);
  expect(gottenDeck.groupId).toEqual(createdDeck.groupId);
  expect(mockDeckFindByPk.mock.calls.length).toEqual(1);
  expect(mockDeckFindByPk.mock.calls[0][0]).toEqual(createdDeck.id);
});

it("should throw DbInternalError if a failure happens when getting the deck to delete", async () => {
  passDeckFindByPk = false;
  let passed: boolean;

  try {
    await mySql.deleteDeck(0);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when deleting a deck", async () => {
  passDeckFindByPk = true;
  passDeckCreate = true;
  passDeckModelDestroy = false;
  let passed: boolean;
  let createdDeck: Deck;

  try {
    createdDeck = await mySql.createDeck("somedeckname", 0, 0);
  } catch (err) {
    expect(false).toBeTruthy();
    createdDeck = new Deck(99, "failed", 99, 99);
  }

  try {
    await mySql.deleteDeck(createdDeck.id);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to delete a deck that does not exist", async () => {
  passDeckFindByPk = true;
  let passed: boolean;
  try {
    await mySql.deleteDeck(1);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully deleting a deck", async () => {
  passDeckFindByPk = true;
  passDeckCreate = true;
  passDeckModelDestroy = true;
  let createdDeck: Deck;
  let passed: boolean;

  try {
    createdDeck = await mySql.createDeck("somedeckname", 0, 0);
  } catch (err) {
    expect(false).toBeTruthy();
    createdDeck = new Deck(99, "failed", 99, 99);
  }

  try {
    await mySql.deleteDeck(createdDeck.id);
    passed = true;
  } catch (err) {
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(decks.length).toEqual(0);
});

it("should throw DbInternalError if a failure happens when getting the deck to update", async () => {
  passDeckFindByPk = false;
  let passed: boolean;
  const updateDeck = new Deck(0, "deckname", 0, 0);

  try {
    await mySql.updateDeck(updateDeck);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbInternalError if a failure happens when updating a deck", async () => {
  passDeckFindByPk = true;
  passDeckCreate = true;
  passDeckModelSave = false;
  let passed: boolean;
  let createdDeck: Deck;

  try {
    createdDeck = await mySql.createDeck("somedeckname", 0, 0);
  } catch (err) {
    expect(false).toBeTruthy();
    createdDeck = new Deck(99, "failed", 99, 99);
  }

  try {
    await mySql.updateDeck(createdDeck);
    passed = false;
  } catch (err) {
    if (err instanceof DbInternalError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should throw DbLookupError when attempting to update a deck that does not exist", async () => {
  passDeckFindByPk = true;
  let passed: boolean;
  const updateDeck = new Deck(0, "deckname", 0, 0);
  try {
    await mySql.updateDeck(updateDeck);
    passed = false;
  } catch (err) {
    if (err instanceof DbLookupError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
});

it("should resolve when successfully updating a deck", async () => {
  passDeckFindByPk = true;
  passDeckCreate = true;
  passDeckModelSave = true;
  let createdDeck: Deck;
  let gottenDeck: Deck;
  let passed: boolean;

  try {
    createdDeck = await mySql.createDeck("somedeckname", 0, 0);
  } catch (err) {
    expect(false).toBeTruthy();
    createdDeck = new Deck(99, "failed", 99, 99);
  }

  createdDeck.deckName = "otherdeckname";

  try {
    await mySql.updateDeck(createdDeck);
  } catch (err) {
    expect(false).toBeTruthy();
  }

  try {
    gottenDeck = await mySql.getDeck(createdDeck.id);
    passed = true;
  } catch (err) {
    gottenDeck = new Deck(99, "failed", 99, 99);
    passed = false;
  }

  expect(passed).toBeTruthy();
  expect(gottenDeck.deckName).toEqual("otherdeckname");
});
