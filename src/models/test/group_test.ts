import StudyGroup from "../group";

/**
 * Unit test suite for the study group model.
 */
it("should be able to get its own ID", () => {
  const group: StudyGroup = new StudyGroup(0, "groupName");
  expect(group.id).toEqual(0);
});

it("should be able to get its own group name", () => {
  const group: StudyGroup = new StudyGroup(0, "groupName");
  expect(group.groupName).toEqual("groupName");
});

it("should be able to set a new group name", () => {
  const group: StudyGroup = new StudyGroup(0, "groupName");
  group.groupName = "newGroupName";
  expect(group.groupName).toEqual("newGroupName");
});

it("should be able to serialize itself into a JSON object", () => {
  const group: StudyGroup = new StudyGroup(0, "groupName");
  const studyGroupInfo = group.serialize();
  expect(studyGroupInfo.id).toEqual(0);
  expect(studyGroupInfo.groupName).toEqual("groupName");
  expect(Object.keys(studyGroupInfo).length).toEqual(2);
});
