import { expect } from "chai";
import "mocha";
import StudyGroup from "./../group";

/**
 * Unit test suite for the study group model.
 */
describe("Study group model", () => {
  it("should be able to get its own ID", () => {
    const group: StudyGroup = new StudyGroup(0, "groupName");
    expect(group.id).to.equal(0);
  });

  it("should be able to get its own group name", () => {
    const group: StudyGroup = new StudyGroup(0, "groupName");
    expect(group.groupName).to.equal("groupName");
  });
});
