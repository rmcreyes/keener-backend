import { expect } from "chai";
import "mocha";
import User from "./../user";

/**
 * Unit test suite for the user model.
 */
describe("User model", () => {
  it("should be able to get its own ID", () => {
    const user: User = new User(0, "username");
    expect(user.id).to.equal(0);
  });

  it("should be able to get its own username", () => {
    const user: User = new User(0, "username");
    expect(user.username).to.equal("username");
  });
});
