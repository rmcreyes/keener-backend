import User from "./../user";

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
