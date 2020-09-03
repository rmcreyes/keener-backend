import ApiHandler from "../handler";
import MockableDbFacade from "../../db/mockable";
import User from "../../models/user";
import StudyGroup from "../../models/group";
import Flashcard from "../../models/flashcard";
import Deck from "../../models/deck";
import { DbLookupError, DbInternalError } from "../../db/errors";
import { ApiUnknownError } from "../errors";
import {
  SinonStubbedClass,
  createSinonStubInstance,
} from "../../utils/sinon_stub";
import { assert } from "sinon";

let apiHandler: ApiHandler;
let mockDbFacade: SinonStubbedClass<MockableDbFacade>;

beforeEach(() => {
  mockDbFacade = createSinonStubInstance(MockableDbFacade);
  apiHandler = new ApiHandler(mockDbFacade);
});

afterEach(() => {
  mockDbFacade.getUser.restore();
  mockDbFacade.createUser.restore();
  mockDbFacade.deleteUser.restore();
  mockDbFacade.updateUser.restore();
  mockDbFacade.getStudyGroup.restore();
  mockDbFacade.createStudyGroup.restore();
  mockDbFacade.deleteStudyGroup.restore();
  mockDbFacade.updateStudyGroup.restore();
  mockDbFacade.getFlashcard.restore();
  mockDbFacade.createFlashcard.restore();
  mockDbFacade.deleteFlashcard.restore();
  mockDbFacade.updateFlashcard.restore();
  mockDbFacade.getDeck.restore();
  mockDbFacade.createDeck.restore();
  mockDbFacade.deleteDeck.restore();
  mockDbFacade.updateDeck.restore();
});

it("should return user data properly when given a user ID that exists", async () => {
  mockDbFacade.getUser.resolves(new User(0, "username"));
  const apiResponse = await apiHandler.getUser(0);
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.username).toEqual("username");
  expect(Object.keys(apiResponse.response).length).toEqual(2);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getUser, 0);
});

it("should notify properly if the requested user could not be found", async () => {
  mockDbFacade.getUser.rejects(new DbLookupError("User could not be found"));
  const apiResponse = await apiHandler.getUser(0);
  expect(apiResponse.response).toEqual("User could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getUser, 0);
});

it("should notify properly if an internal database error happens when retrieving the user information", async () => {
  mockDbFacade.getUser.rejects(new DbInternalError("Internal database error"));
  const apiResponse = await apiHandler.getUser(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getUser, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during user info retrieval", async () => {
  let passed: boolean;
  mockDbFacade.getUser.rejects("Unknown error");
  try {
    await apiHandler.getUser(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getUser, 0);
});

it("should return user data properly when creating a user successfully", async () => {
  mockDbFacade.createUser.resolves(new User(0, "username"));
  const apiResponse = await apiHandler.createUser("username");
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.username).toEqual("username");
  expect(Object.keys(apiResponse.response).length).toEqual(2);
  expect(apiResponse.code).toEqual(201);
  assert.calledWith(mockDbFacade.createUser, "username");
});

it("should notify properly if an internal database error happens when creating the user in the database", async () => {
  mockDbFacade.createUser.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.createUser("username");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.createUser, "username");
});

it("should reject with ApiUnknownError if the database access is rejected during user creation", async () => {
  let passed: boolean;
  mockDbFacade.createUser.rejects("Unknown error");
  try {
    await apiHandler.createUser("username");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.createUser, "username");
});

it("should be able to properly indicate a successful user deletion", async () => {
  mockDbFacade.deleteUser.resolves();
  const apiResponse = await apiHandler.deleteUser(0);
  expect(apiResponse.response).toEqual("User with ID 0 successfully deleted");
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.deleteUser, 0);
});

it("should notify properly if the user to delete could not be found", async () => {
  mockDbFacade.deleteUser.rejects(new DbLookupError("User could not be found"));
  const apiResponse = await apiHandler.deleteUser(0);
  expect(apiResponse.response).toEqual("User could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.deleteUser, 0);
});

it("should notify properly if an internal database error happens when deleting the user in the database", async () => {
  mockDbFacade.deleteUser.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.deleteUser(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.deleteUser, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during user deletion", async () => {
  let passed: boolean;
  mockDbFacade.deleteUser.rejects("Unknown error");
  try {
    await apiHandler.deleteUser(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.deleteUser, 0);
});

it("should return user data properly when updating a user successfully", async () => {
  mockDbFacade.getUser.resolves(new User(0, "username"));
  mockDbFacade.updateUser.resolves(new User(0, "newUsername"));
  const apiResponse = await apiHandler.updateUser(0, "newUsername");
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.username).toEqual("newUsername");
  expect(Object.keys(apiResponse.response).length).toEqual(2);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.calledWith(mockDbFacade.updateUser, new User(0, "newUsername"));
});

it("should notify properly if no user fields have been specified to be updated", async () => {
  const apiResponse = await apiHandler.updateUser(0);
  expect(apiResponse.response).toEqual(
    "No fields have been requested to be updated. Please specify fields to update"
  );
  expect(apiResponse.code).toEqual(400);
});

it("should notify properly if the user to update could not be found during the initial info retrieval when updating a user", async () => {
  mockDbFacade.getUser.rejects(new DbLookupError("User could not be found"));
  const apiResponse = await apiHandler.updateUser(0, "newUsername");
  expect(apiResponse.response).toEqual("User could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.notCalled(mockDbFacade.updateUser);
});

it("should notify properly if an internal database error happens during the initial user info retrieval when updating a user", async () => {
  mockDbFacade.getUser.rejects(new DbInternalError("Internal database error"));
  const apiResponse = await apiHandler.updateUser(0, "newUsername");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.notCalled(mockDbFacade.updateUser);
});

it("should reject with ApiUnknownError if the database access is rejected during the initial user info retrieval when updating a user", async () => {
  let passed: boolean;
  mockDbFacade.getUser.rejects("Unknown error");
  try {
    await apiHandler.updateUser(0, "newUsername");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.notCalled(mockDbFacade.updateUser);
});

it("should notify properly if the user to update could not be found during a user update", async () => {
  mockDbFacade.getUser.resolves(new User(0, "username"));
  mockDbFacade.updateUser.rejects(new DbLookupError("User could not be found"));
  const apiResponse = await apiHandler.updateUser(0, "newUsername");
  expect(apiResponse.response).toEqual(
    "User deleted before update could be completed - User could not be found"
  );
  expect(apiResponse.code).toEqual(409);
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.calledWith(mockDbFacade.updateUser, new User(0, "newUsername"));
});

it("should notify properly if an internal database error happens during a user update", async () => {
  mockDbFacade.getUser.resolves(new User(0, "username"));
  mockDbFacade.updateUser.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.updateUser(0, "newUsername");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.calledWith(mockDbFacade.updateUser, new User(0, "newUsername"));
});

it("should reject with ApiUnknownError if the database access is rejected during a user update", async () => {
  let passed: boolean;
  mockDbFacade.getUser.resolves(new User(0, "username"));
  mockDbFacade.updateUser.rejects("Unknown error");
  try {
    await apiHandler.updateUser(0, "newUsername");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getUser, 0);
  assert.calledWith(mockDbFacade.updateUser, new User(0, "newUsername"));
});

it("should return study group data properly when given a study group ID that exists", async () => {
  mockDbFacade.getStudyGroup.resolves(new StudyGroup(0, "groupName"));
  const apiResponse = await apiHandler.getStudyGroup(0);
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.groupName).toEqual("groupName");
  expect(Object.keys(apiResponse.response).length).toEqual(2);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
});

it("should notify properly if the requested study group could not be found", async () => {
  mockDbFacade.getStudyGroup.rejects(
    new DbLookupError("Study group could not be found")
  );
  const apiResponse = await apiHandler.getStudyGroup(0);
  expect(apiResponse.response).toEqual("Study group could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
});

it("should notify properly if an internal database error happens when retrieving the study group information", async () => {
  mockDbFacade.getStudyGroup.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.getStudyGroup(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during study group info retrieval", async () => {
  let passed: boolean;
  mockDbFacade.getStudyGroup.rejects("Unknown error");
  try {
    await apiHandler.getStudyGroup(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
});

it("should return study group data properly when creating a study group successfully", async () => {
  mockDbFacade.createStudyGroup.resolves(new StudyGroup(0, "groupName"));
  const apiResponse = await apiHandler.createStudyGroup("groupName");
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.groupName).toEqual("groupName");
  expect(Object.keys(apiResponse.response).length).toEqual(2);
  expect(apiResponse.code).toEqual(201);
  assert.calledWith(mockDbFacade.createStudyGroup, "groupName");
});

it("should notify properly if an internal database error happens when creating the study group in the database", async () => {
  mockDbFacade.createStudyGroup.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.createStudyGroup("groupName");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.createStudyGroup, "groupName");
});

it("should reject with ApiUnknownError if the database access is rejected during study group creation", async () => {
  let passed: boolean;
  mockDbFacade.createStudyGroup.rejects("Unknown error");
  try {
    await apiHandler.createStudyGroup("groupName");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.createStudyGroup, "groupName");
});

it("should be able to properly indicate a successful study group deletion", async () => {
  mockDbFacade.deleteStudyGroup.resolves();
  const apiResponse = await apiHandler.deleteStudyGroup(0);
  expect(apiResponse.response).toEqual(
    "Study group with ID 0 successfully deleted"
  );
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.deleteStudyGroup, 0);
});

it("should notify properly if the study group to delete could not be found", async () => {
  mockDbFacade.deleteStudyGroup.rejects(
    new DbLookupError("Study group could not be found")
  );
  const apiResponse = await apiHandler.deleteStudyGroup(0);
  expect(apiResponse.response).toEqual("Study group could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.deleteStudyGroup, 0);
});

it("should notify properly if an internal database error happens when deleting the study group in the database", async () => {
  mockDbFacade.deleteStudyGroup.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.deleteStudyGroup(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.deleteStudyGroup, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during study group deletion", async () => {
  let passed: boolean;
  mockDbFacade.deleteStudyGroup.rejects("Unknown error");
  try {
    await apiHandler.deleteStudyGroup(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.deleteStudyGroup, 0);
});

it("should return study group data properly when updating a study group successfully", async () => {
  mockDbFacade.getStudyGroup.resolves(new StudyGroup(0, "groupName"));
  mockDbFacade.updateStudyGroup.resolves(new StudyGroup(0, "newGroupName"));
  const apiResponse = await apiHandler.updateStudyGroup(0, "newGroupName");
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.groupName).toEqual("newGroupName");
  expect(Object.keys(apiResponse.response).length).toEqual(2);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.calledWith(
    mockDbFacade.updateStudyGroup,
    new StudyGroup(0, "newGroupName")
  );
});

it("should notify properly if no study group fields have been specified to be updated", async () => {
  const apiResponse = await apiHandler.updateStudyGroup(0);
  expect(apiResponse.response).toEqual(
    "No fields have been requested to be updated. Please specify fields to update"
  );
  expect(apiResponse.code).toEqual(400);
});

it("should notify properly if the study group to update could not be found during the initial info retrieval when updating a study group", async () => {
  mockDbFacade.getStudyGroup.rejects(
    new DbLookupError("Study group could not be found")
  );
  const apiResponse = await apiHandler.updateStudyGroup(0, "newGroupName");
  expect(apiResponse.response).toEqual("Study group could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.notCalled(mockDbFacade.updateStudyGroup);
});

it("should notify properly if an internal database error happens during the initial study group info retrieval when updating a study group", async () => {
  mockDbFacade.getStudyGroup.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.updateStudyGroup(0, "newGroupName");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.notCalled(mockDbFacade.updateStudyGroup);
});

it("should reject with ApiUnknownError if the database access is rejected during the initial study group info retrieval when updating a study group", async () => {
  let passed: boolean;
  mockDbFacade.getStudyGroup.rejects("Unknown error");
  try {
    await apiHandler.updateStudyGroup(0, "newGroupName");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.notCalled(mockDbFacade.updateStudyGroup);
});

it("should notify properly if the study group to update could not be found during a study group update", async () => {
  mockDbFacade.getStudyGroup.resolves(new StudyGroup(0, "groupName"));
  mockDbFacade.updateStudyGroup.rejects(
    new DbLookupError("Study group could not be found")
  );
  const apiResponse = await apiHandler.updateStudyGroup(0, "newGroupName");
  expect(apiResponse.response).toEqual(
    "Study group deleted before update could be completed - Study group could not be found"
  );
  expect(apiResponse.code).toEqual(409);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.calledWith(
    mockDbFacade.updateStudyGroup,
    new StudyGroup(0, "newGroupName")
  );
});

it("should notify properly if an internal database error happens during a study group update", async () => {
  mockDbFacade.getStudyGroup.resolves(new StudyGroup(0, "groupName"));
  mockDbFacade.updateStudyGroup.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.updateStudyGroup(0, "newGroupName");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.calledWith(
    mockDbFacade.updateStudyGroup,
    new StudyGroup(0, "newGroupName")
  );
});

it("should reject with ApiUnknownError if the database access is rejected during a study group update", async () => {
  let passed: boolean;
  mockDbFacade.getStudyGroup.resolves(new StudyGroup(0, "groupName"));
  mockDbFacade.updateStudyGroup.rejects("Unknown error");
  try {
    await apiHandler.updateStudyGroup(0, "newGroupName");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getStudyGroup, 0);
  assert.calledWith(
    mockDbFacade.updateStudyGroup,
    new StudyGroup(0, "newGroupName")
  );
});

it("should return flashcard data properly when given a flashcard ID that exists", async () => {
  mockDbFacade.getFlashcard.resolves(
    new Flashcard(0, "question", "answer", 0, 0)
  );
  const apiResponse = await apiHandler.getFlashcard(0);
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.question).toEqual("question");
  expect(apiResponse.response.answer).toEqual("answer");
  expect(apiResponse.response.creatorId).toEqual(0);
  expect(apiResponse.response.deckId).toEqual(0);
  expect(Object.keys(apiResponse.response).length).toEqual(5);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
});

it("should notify properly if the requested flashcard could not be found", async () => {
  mockDbFacade.getFlashcard.rejects(
    new DbLookupError("Flashcard could not be found")
  );
  const apiResponse = await apiHandler.getFlashcard(0);
  expect(apiResponse.response).toEqual("Flashcard could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
});

it("should notify properly if an internal database error happens when retrieving the flashcard information", async () => {
  mockDbFacade.getFlashcard.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.getFlashcard(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during flashcard info retrieval", async () => {
  let passed: boolean;
  mockDbFacade.getFlashcard.rejects("Unknown error");
  try {
    await apiHandler.getFlashcard(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getFlashcard, 0);
});

it("should return flashcard data properly when creating a flashcard successfully", async () => {
  mockDbFacade.createFlashcard.resolves(
    new Flashcard(0, "question", "answer", 0, 0)
  );
  const apiResponse = await apiHandler.createFlashcard(
    "question",
    "answer",
    0,
    0
  );
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.question).toEqual("question");
  expect(apiResponse.response.answer).toEqual("answer");
  expect(apiResponse.response.creatorId).toEqual(0);
  expect(apiResponse.response.deckId).toEqual(0);
  expect(Object.keys(apiResponse.response).length).toEqual(5);
  expect(apiResponse.code).toEqual(201);
  assert.calledWith(mockDbFacade.createFlashcard, "question", "answer", 0, 0);
});

it("should notify properly if an internal database error happens when creating the flashcard in the database", async () => {
  mockDbFacade.createFlashcard.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.createFlashcard(
    "question",
    "answer",
    0,
    0
  );
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.createFlashcard, "question", "answer", 0, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during flashcard creation", async () => {
  let passed: boolean;
  mockDbFacade.createFlashcard.rejects("Unknown error");
  try {
    await apiHandler.createFlashcard("question", "answer", 0, 0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.createFlashcard, "question", "answer", 0, 0);
});

it("should be able to properly indicate a successful flashcard deletion", async () => {
  mockDbFacade.deleteFlashcard.resolves();
  const apiResponse = await apiHandler.deleteFlashcard(0);
  expect(apiResponse.response).toEqual(
    "Flashcard with ID 0 successfully deleted"
  );
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.deleteFlashcard, 0);
});

it("should notify properly if the flashcard to delete could not be found", async () => {
  mockDbFacade.deleteFlashcard.rejects(
    new DbLookupError("Flashcard could not be found")
  );
  const apiResponse = await apiHandler.deleteFlashcard(0);
  expect(apiResponse.response).toEqual("Flashcard could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.deleteFlashcard, 0);
});

it("should notify properly if an internal database error happens when deleting the flashcard in the database", async () => {
  mockDbFacade.deleteFlashcard.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.deleteFlashcard(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.deleteFlashcard, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during flashcard deletion", async () => {
  let passed: boolean;
  mockDbFacade.deleteFlashcard.rejects("Unknown error");
  try {
    await apiHandler.deleteFlashcard(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.deleteFlashcard, 0);
});

it("should return flashcard data properly when updating a flashcard successfully", async () => {
  mockDbFacade.getFlashcard.resolves(
    new Flashcard(0, "question", "answer", 0, 0)
  );
  mockDbFacade.updateFlashcard.resolves(
    new Flashcard(0, "question", "newAnswer", 0, 0)
  );
  const apiResponse = await apiHandler.updateFlashcard(0, "newAnswer");
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.question).toEqual("question");
  expect(apiResponse.response.answer).toEqual("newAnswer");
  expect(apiResponse.response.creatorId).toEqual(0);
  expect(apiResponse.response.deckId).toEqual(0);
  expect(Object.keys(apiResponse.response).length).toEqual(5);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.calledWith(
    mockDbFacade.updateFlashcard,
    new Flashcard(0, "question", "newAnswer", 0, 0)
  );
});

it("should notify properly if no flashcard fields have been specified to be updated", async () => {
  const apiResponse = await apiHandler.updateFlashcard(0);
  expect(apiResponse.response).toEqual(
    "No fields have been requested to be updated. Please specify fields to update"
  );
  expect(apiResponse.code).toEqual(400);
});

it("should notify properly if the flashcard to update could not be found during the initial info retrieval when updating a flashcard", async () => {
  mockDbFacade.getFlashcard.rejects(
    new DbLookupError("Flashcard could not be found")
  );
  const apiResponse = await apiHandler.updateFlashcard(0, "newAnswer");
  expect(apiResponse.response).toEqual("Flashcard could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.notCalled(mockDbFacade.updateFlashcard);
});

it("should notify properly if an internal database error happens during the initial flashcard info retrieval when updating a flashcard", async () => {
  mockDbFacade.getFlashcard.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.updateFlashcard(0, "newAnswer");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.notCalled(mockDbFacade.updateFlashcard);
});

it("should reject with ApiUnknownError if the database access is rejected during the initial flashcard info retrieval when updating a flashcard", async () => {
  let passed: boolean;
  mockDbFacade.getFlashcard.rejects("Unknown error");
  try {
    await apiHandler.updateFlashcard(0, "newAnswer");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.notCalled(mockDbFacade.updateFlashcard);
});

it("should notify properly if the flashcard to update could not be found during a flashcard update", async () => {
  mockDbFacade.getFlashcard.resolves(
    new Flashcard(0, "question", "answer", 0, 0)
  );
  mockDbFacade.updateFlashcard.rejects(
    new DbLookupError("Flashcard could not be found")
  );
  const apiResponse = await apiHandler.updateFlashcard(0, "newAnswer");
  expect(apiResponse.response).toEqual(
    "Flashcard deleted before update could be completed - Flashcard could not be found"
  );
  expect(apiResponse.code).toEqual(409);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.calledWith(
    mockDbFacade.updateFlashcard,
    new Flashcard(0, "question", "newAnswer", 0, 0)
  );
});

it("should notify properly if an internal database error happens during a flashcard update", async () => {
  mockDbFacade.getFlashcard.resolves(
    new Flashcard(0, "question", "answer", 0, 0)
  );
  mockDbFacade.updateFlashcard.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.updateFlashcard(0, "newAnswer");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.calledWith(
    mockDbFacade.updateFlashcard,
    new Flashcard(0, "question", "newAnswer", 0, 0)
  );
});

it("should reject with ApiUnknownError if the database access is rejected during a flashcard update", async () => {
  let passed: boolean;
  mockDbFacade.getFlashcard.resolves(
    new Flashcard(0, "question", "answer", 0, 0)
  );
  mockDbFacade.updateFlashcard.rejects("Unknown error");
  try {
    await apiHandler.updateFlashcard(0, "newAnswer");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getFlashcard, 0);
  assert.calledWith(
    mockDbFacade.updateFlashcard,
    new Flashcard(0, "question", "newAnswer", 0, 0)
  );
});

it("should return deck data properly when given a deck ID that exists", async () => {
  mockDbFacade.getDeck.resolves(new Deck(0, "deckName", 0, 0));
  const apiResponse = await apiHandler.getDeck(0);
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.deckName).toEqual("deckName");
  expect(apiResponse.response.creatorId).toEqual(0);
  expect(apiResponse.response.groupId).toEqual(0);
  expect(Object.keys(apiResponse.response).length).toEqual(4);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getDeck, 0);
});

it("should notify properly if the requested deck could not be found", async () => {
  mockDbFacade.getDeck.rejects(new DbLookupError("Deck could not be found"));
  const apiResponse = await apiHandler.getDeck(0);
  expect(apiResponse.response).toEqual("Deck could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getDeck, 0);
});

it("should notify properly if an internal database error happens when retrieving the deck information", async () => {
  mockDbFacade.getDeck.rejects(new DbInternalError("Internal database error"));
  const apiResponse = await apiHandler.getDeck(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getDeck, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during deck info retrieval", async () => {
  let passed: boolean;
  mockDbFacade.getDeck.rejects("Unknown error");
  try {
    await apiHandler.getDeck(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getDeck, 0);
});

it("should return deck data properly when creating a deck successfully", async () => {
  mockDbFacade.createDeck.resolves(new Deck(0, "deckName", 0, 0));
  const apiResponse = await apiHandler.createDeck("deckName", 0, 0);
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.deckName).toEqual("deckName");
  expect(apiResponse.response.creatorId).toEqual(0);
  expect(apiResponse.response.groupId).toEqual(0);
  expect(Object.keys(apiResponse.response).length).toEqual(4);
  expect(apiResponse.code).toEqual(201);
  assert.calledWith(mockDbFacade.createDeck, "deckName", 0, 0);
});

it("should notify properly if an internal database error happens when creating the deck in the database", async () => {
  mockDbFacade.createDeck.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.createDeck("deckName", 0, 0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.createDeck, "deckName", 0, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during deck creation", async () => {
  let passed: boolean;
  mockDbFacade.createDeck.rejects("Unknown error");
  try {
    await apiHandler.createDeck("deckName", 0, 0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.createDeck, "deckName", 0, 0);
});

it("should be able to properly indicate a successful deck deletion", async () => {
  mockDbFacade.deleteDeck.resolves();
  const apiResponse = await apiHandler.deleteDeck(0);
  expect(apiResponse.response).toEqual("Deck with ID 0 successfully deleted");
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.deleteDeck, 0);
});

it("should notify properly if the deck to delete could not be found", async () => {
  mockDbFacade.deleteDeck.rejects(new DbLookupError("Deck could not be found"));
  const apiResponse = await apiHandler.deleteDeck(0);
  expect(apiResponse.response).toEqual("Deck could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.deleteDeck, 0);
});

it("should notify properly if an internal database error happens when deleting the deck in the database", async () => {
  mockDbFacade.deleteDeck.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.deleteDeck(0);
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.deleteDeck, 0);
});

it("should reject with ApiUnknownError if the database access is rejected during deck deletion", async () => {
  let passed: boolean;
  mockDbFacade.deleteDeck.rejects("Unknown error");
  try {
    await apiHandler.deleteDeck(0);
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.deleteDeck, 0);
});

it("should return deck data properly when updating a deck successfully", async () => {
  mockDbFacade.getDeck.resolves(new Deck(0, "deckName", 0, 0));
  mockDbFacade.updateDeck.resolves(new Deck(0, "newDeckName", 0, 0));
  const apiResponse = await apiHandler.updateDeck(0, "newDeckName");
  expect(apiResponse.response.id).toEqual(0);
  expect(apiResponse.response.deckName).toEqual("newDeckName");
  expect(apiResponse.response.creatorId).toEqual(0);
  expect(apiResponse.response.groupId).toEqual(0);
  expect(Object.keys(apiResponse.response).length).toEqual(4);
  expect(apiResponse.code).toEqual(200);
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.calledWith(mockDbFacade.updateDeck, new Deck(0, "newDeckName", 0, 0));
});

it("should notify properly if no deck fields have been specified to be updated", async () => {
  const apiResponse = await apiHandler.updateDeck(0);
  expect(apiResponse.response).toEqual(
    "No fields have been requested to be updated. Please specify fields to update"
  );
  expect(apiResponse.code).toEqual(400);
});

it("should notify properly if the deck to update could not be found during the initial info retrieval when updating a deck", async () => {
  mockDbFacade.getDeck.rejects(new DbLookupError("Deck could not be found"));
  const apiResponse = await apiHandler.updateDeck(0, "newDeckName");
  expect(apiResponse.response).toEqual("Deck could not be found");
  expect(apiResponse.code).toEqual(404);
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.notCalled(mockDbFacade.updateDeck);
});

it("should notify properly if an internal database error happens during the initial deck info retrieval when updating a deck", async () => {
  mockDbFacade.getDeck.rejects(new DbInternalError("Internal database error"));
  const apiResponse = await apiHandler.updateDeck(0, "newDeckName");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.notCalled(mockDbFacade.updateDeck);
});

it("should reject with ApiUnknownError if the database access is rejected during the initial deck info retrieval when updating a deck", async () => {
  let passed: boolean;
  mockDbFacade.getDeck.rejects("Unknown error");
  try {
    await apiHandler.updateDeck(0, "newDeckName");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.notCalled(mockDbFacade.updateDeck);
});

it("should notify properly if the deck to update could not be found during a deck update", async () => {
  mockDbFacade.getDeck.resolves(new Deck(0, "deckName", 0, 0));
  mockDbFacade.updateDeck.rejects(new DbLookupError("Deck could not be found"));
  const apiResponse = await apiHandler.updateDeck(0, "newDeckName");
  expect(apiResponse.response).toEqual(
    "Deck deleted before update could be completed - Deck could not be found"
  );
  expect(apiResponse.code).toEqual(409);
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.calledWith(mockDbFacade.updateDeck, new Deck(0, "newDeckName", 0, 0));
});

it("should notify properly if an internal database error happens during a deck update", async () => {
  mockDbFacade.getDeck.resolves(new Deck(0, "deckName", 0, 0));
  mockDbFacade.updateDeck.rejects(
    new DbInternalError("Internal database error")
  );
  const apiResponse = await apiHandler.updateDeck(0, "newDeckName");
  expect(apiResponse.response).toEqual("Internal database error");
  expect(apiResponse.code).toEqual(500);
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.calledWith(mockDbFacade.updateDeck, new Deck(0, "newDeckName", 0, 0));
});

it("should reject with ApiUnknownError if the database access is rejected during a deck update", async () => {
  let passed: boolean;
  mockDbFacade.getDeck.resolves(new Deck(0, "deckName", 0, 0));
  mockDbFacade.updateDeck.rejects("Unknown error");
  try {
    await apiHandler.updateDeck(0, "newDeckName");
    passed = false;
  } catch (err) {
    if (err instanceof ApiUnknownError) passed = true;
    else passed = false;
  }
  expect(passed).toBeTruthy();
  assert.calledWith(mockDbFacade.getDeck, 0);
  assert.calledWith(mockDbFacade.updateDeck, new Deck(0, "newDeckName", 0, 0));
});
