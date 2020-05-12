import { expect } from "chai";
import "mocha";
import Deck from "./../deck";

/**
 * Unit test suite for the flashcard deck model.
 */
describe("Deck model", () => {
  it("should be able to get its own ID", () => {
    const deck: Deck = new Deck(0, "deckName", 0, 0);
    expect(deck.id).to.equal(0);
  });

  it("should be able to get its own deck name", () => {
    const deck: Deck = new Deck(0, "deckName", 0, 0);
    expect(deck.deckName).to.equal("deckName");
  });

  it("should be able to get the ID of its creator", () => {
    const deck: Deck = new Deck(0, "deckName", 0, 0);
    expect(deck.creatorId).to.equal(0);
  });

  it("should be able to get the ID of its group", () => {
    const deck: Deck = new Deck(0, "deckName", 0, 0);
    expect(deck.groupId).to.equal(0);
  });
});
