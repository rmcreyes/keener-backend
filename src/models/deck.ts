/**
 * Interface for deck info serialization.
 */
export interface DeckInfo {
  readonly id: number;
  readonly deckName: string;
  readonly creatorId: number;
  readonly groupId: number;
}

/**
 * Data model for a flashcard deck.
 */
export default class Deck {
  private _id: number;
  private _deckName: string;
  private _creatorId: number;
  private _groupId: number;

  /**
   *
   * @param id ID of the deck
   * @param deckName name of the deck
   * @param creatorId ID of the user who created this deck
   * @param groupId ID of the study group this deck belongs to
   */
  constructor(
    id: number,
    deckName: string,
    creatorId: number,
    groupId: number
  ) {
    this._id = id;
    this._deckName = deckName;
    this._creatorId = creatorId;
    this._groupId = groupId;
  }

  /**
   * Getter method for the deck's ID.
   *
   * @returns ID of the deck
   */
  get id(): number {
    return this._id;
  }

  /**
   * Getter method for the deck's name.
   *
   * @return name of the deck
   */
  get deckName(): string {
    return this._deckName;
  }

  /**
   * Setter method for a deck's name.
   *
   * @param newDeckName name to replace this deck's original name with
   */
  set deckName(newDeckName: string) {
    this._deckName = newDeckName;
  }

  /**
   * Getter method for the deck's creator's ID.
   */
  get creatorId(): number {
    return this._creatorId;
  }

  /**
   * Getter method for the deck's group's ID.
   */
  get groupId(): number {
    return this._groupId;
  }

  /**
   * Serialize the properties of this deck instance into a JSON object.
   *
   * @returns JSON object containing the info of this deck instance
   */
  public serialize(): DeckInfo {
    return {
      id: this._id,
      deckName: this._deckName,
      creatorId: this._creatorId,
      groupId: this._groupId,
    };
  }
}
