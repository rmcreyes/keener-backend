import User from "models/user";

/**
 * Unit test suite for the user model.
 */
it("should be able to get its own ID", () => {
  const user: User = new User(0, "username");
  expect(user.id).toEqual(0);
});

it("should be able to get its own username", () => {
  const user: User = new User(0, "username");
  expect(user.username).toEqual("username");
});

it("should be able to set a new username", () => {
  const user: User = new User(0, "username");
  user.username = "newUsername";
  expect(user.username).toEqual("newUsername");
});

it("should be able to serialize itself into a JSON object", () => {
  const user: User = new User(0, "username");
  const userInfo = user.serialize();
  expect(userInfo.id).toEqual(0);
  expect(userInfo.username).toEqual("username");
  expect(Object.keys(userInfo).length).toEqual(2);
});
