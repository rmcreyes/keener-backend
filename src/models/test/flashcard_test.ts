import Flashcard from "../flashcard";

/**
 * Unit test suite for the flashcard model.
 */
it("should be able to get its own ID", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  expect(flashcard.id).toEqual(0);
});

it("should be able to get its own question", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  expect(flashcard.question).toEqual("marco");
});

it("should be able to get its own answer", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  expect(flashcard.answer).toEqual("polo");
});

it("should be able to set a new answer", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  flashcard.answer = "collared shirt";
  expect(flashcard.answer).toEqual("collared shirt");
});

it("should be able to get the ID of its creator", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  expect(flashcard.creatorId).toEqual(0);
});

it("should be able to get the ID of the deck it belongs to", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  expect(flashcard.deckId).toEqual(0);
});

it("should be able to serialize itself into a JSON object", () => {
  const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
  const flashcardInfo = flashcard.serialize();
  expect(flashcardInfo.id).toEqual(0);
  expect(flashcardInfo.question).toEqual("marco");
  expect(flashcardInfo.answer).toEqual("polo");
  expect(flashcardInfo.creatorId).toEqual(0);
  expect(flashcardInfo.deckId).toEqual(0);
  expect(Object.keys(flashcardInfo).length).toEqual(5);
});
