/**
 * Interface for flashcard info serialization.
 */
export interface FlashcardInfo {
  readonly id: number;
  readonly question: string;
  readonly answer: string;
  readonly creatorId: number;
  readonly deckId: number;
}

/**
 * Data model for a flashcard.
 */
export default class Flashcard {
  private _id: number;
  private _question: string;
  private _answer: string;
  private _creatorId: number;
  private _deckId: number;

  /**
   * Constructor of the flashcard model.
   *
   * @param id ID of the flashcard
   * @param question question on the flashcard
   * @param answer answer to the question on the flashcard
   * @param creatorId ID of the user who created this flashcard
   * @param deckId ID of the deck this flashcard belongs to
   */
  constructor(
    id: number,
    question: string,
    answer: string,
    creatorId: number,
    deckId: number
  ) {
    this._id = id;
    this._question = question;
    this._answer = answer;
    this._creatorId = creatorId;
    this._deckId = deckId;
  }

  /**
   * Getter method for the flashcard's ID.
   *
   * @returns ID of the flashcard
   */
  get id(): number {
    return this._id;
  }

  /**
   * Getter method for the flashcard's question.
   *
   * @returns question of the flashcard
   */
  get question(): string {
    return this._question;
  }

  /**
   * Getter method for the flashcard's answer.
   *
   * @returns answer of the flashcard
   */
  get answer(): string {
    return this._answer;
  }

  /**
   * Setter method for a flashcard's new answer.
   *
   * @param newAnswer answer to replace this flashcard's original answer with
   */
  set answer(newAnswer: string) {
    this._answer = newAnswer;
  }

  /**
   * Getter method for a flashcard's creator ID.
   *
   * @returns ID of the user who created this flashcard
   */
  get creatorId(): number {
    return this._creatorId;
  }

  /**
   * Getter method for a flashcard's deck ID
   *
   * @return ID of the deck this flashcard belongs to
   */
  get deckId(): number {
    return this._deckId;
  }

  /**
   * Serialize the properties of this flashcard instance into a JSON object.
   *
   * @returns JSON object containing the info of this flashcard instance
   */
  public serialize(): FlashcardInfo {
    return {
      id: this._id,
      question: this._question,
      answer: this._answer,
      creatorId: this._creatorId,
      deckId: this._deckId,
    };
  }
}
