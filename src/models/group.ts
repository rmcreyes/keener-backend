/**
 * Interface for study group info serialization.
 */
export interface StudyGroupInfo {
  readonly id: number;
  readonly groupName: string;
}

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

  /**
   * Setter method for a study group's new name.
   */
  set groupName(newGroupName: string) {
    this._groupName = newGroupName;
  }

  /**
   * Serialize the properties of this study group instance into a JSON object.
   *
   * @returns JSON object containing the info of this study group instance
   */
  public serialize(): StudyGroupInfo {
    return {
      id: this._id,
      groupName: this._groupName,
    };
  }
}
