import Deck from "models/deck";

/**
 * Unit test suite for the flashcard deck model.
 */
it("should be able to get its own ID", () => {
  const deck: Deck = new Deck(0, "deckName", 0, 0);
  expect(deck.id).toEqual(0);
});

it("should be able to get its own deck name", () => {
  const deck: Deck = new Deck(0, "deckName", 0, 0);
  expect(deck.deckName).toEqual("deckName");
});

it("should be able to set a new deck name", () => {
  const deck: Deck = new Deck(0, "deckName", 0, 0);
  deck.deckName = "newDeckName";
  expect(deck.deckName).toEqual("newDeckName");
});

it("should be able to get the ID of its creator", () => {
  const deck: Deck = new Deck(0, "deckName", 0, 0);
  expect(deck.creatorId).toEqual(0);
});

it("should be able to get the ID of its group", () => {
  const deck: Deck = new Deck(0, "deckName", 0, 0);
  expect(deck.groupId).toEqual(0);
});

it("should be able to serialize itself into a JSON object", () => {
  const deck: Deck = new Deck(0, "deckName", 0, 0);
  const deckInfo = deck.serialize();
  expect(deckInfo.id).toEqual(0);
  expect(deckInfo.deckName).toEqual("deckName");
  expect(deckInfo.creatorId).toEqual(0);
  expect(deckInfo.groupId).toEqual(0);
  expect(Object.keys(deckInfo).length).toEqual(4);
});
