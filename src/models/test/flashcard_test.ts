import { expect } from "chai";
import "mocha";
import Flashcard from "./../flashcard";

/**
 * Unit test suite for the flashcard model.
 */
describe("Flashcard model", () => {
  it("should be able to get its own ID", () => {
    const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
    expect(flashcard.id).to.equal(0);
  });

  it("should be able to get its own question", () => {
    const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
    expect(flashcard.question).to.equal("marco");
  });

  it("should be able to get its own answer", () => {
    const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
    expect(flashcard.answer).to.equal("polo");
  });

  it("should be able to set a new answer", () => {
    const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
    flashcard.answer = "collared shirt";
    expect(flashcard.answer).to.equal("collared shirt");
  });

  it("should be able to get the ID of its creator", () => {
    const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
    expect(flashcard.creatorId).to.equal(0);
  });

  it("should be able to get the ID of the deck it belongs to", () => {
    const flashcard: Flashcard = new Flashcard(0, "marco", "polo", 0, 0);
    expect(flashcard.deckId).to.equal(0);
  });
});
