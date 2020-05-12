/**
 * Data model for a study group.
 */
export default class StudyGroup {
  private _id: number;
  private _groupName: string;

  /**
   * Constructor of the study group model.
   *
   * @param id ID of the study group
   * @param groupName name of study group
   */
  constructor(id: number, groupName: string) {
    this._id = id;
    this._groupName = groupName;
  }

  /**
   * Getter method for the study group's ID.
   *
   * @returns ID of the study group
   */
  get id(): number {
    return this._id;
  }

  /**
   * Getter method for the study group's name.
   *
   * @returns name of the study group
   */
  get groupName(): string {
    return this._groupName;
  }
}
