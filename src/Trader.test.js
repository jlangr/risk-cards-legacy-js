import { expect } from 'chai';
import Card, { CANNON, CAVALRY, INFANTRY, WILDCARD } from './Card';
import { CARD_INCREASING_SET, CARD_FIXED_SET, CARD_ITALIANLIKE_SET } from './Trader';
import Trader from './Trader';

describe('a trader', () => {
  let trader;
  let bestResult;

  beforeEach(() => {
    bestResult = []; // size 3?
    trader = new Trader();
  });

  describe('populates best result with', () => {
    beforeEach(() =>  {
      trader.setCardMode(CARD_INCREASING_SET)
    });

    it('returns three matching when only three', () => {
      trader.getBestTrade(cards([CANNON, CANNON, CANNON]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([CANNON, CANNON, CANNON]);
    });

    it('returnsThreeMatchingFromLargerHand', () => {
      trader.getBestTrade(cards([INFANTRY, CANNON, INFANTRY, CANNON, INFANTRY]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([INFANTRY, INFANTRY, INFANTRY]);
    });

    it('returnsThreeWithHigherScore', () => {
      trader.getBestTrade(cards([INFANTRY, CANNON, INFANTRY, CAVALRY, INFANTRY]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([CANNON, CAVALRY, INFANTRY]);
    });

    it('order1', () => {
      trader.getBestTrade(uniqueCards(
              [INFANTRY, 0,
              CANNON, 1,
              INFANTRY, 2,
              INFANTRY, 3,
              CAVALRY, 4]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([CANNON, CAVALRY, INFANTRY]);
    });

    it('order2', () => {
      trader.getBestTrade(uniqueCards(
              [CAVALRY, 0,
              CANNON, 1,
              CANNON, 2,
              CAVALRY, 3,
              CAVALRY, 4]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([CAVALRY, CAVALRY, CAVALRY]);
    });

    it('order3WithOneWildcard', () => {
      trader.getBestTrade(uniqueCards(
              [CAVALRY, 0,
              CANNON, 1,
              CANNON, 2,
              WILDCARD, 3]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([CANNON, CAVALRY, WILDCARD]);
    });

    it('order3WithTwoWildcards', () => {
      trader.getBestTrade(uniqueCards(
              [CAVALRY, 0,
              WILDCARD, 1,
              INFANTRY, 2,
              WILDCARD, 3]), bestResult);

      expect(cardTypes(bestResult)).to.deep.equal([WILDCARD, CAVALRY, INFANTRY]);
    });

    it('doesNotPopulateBestResultWhenInsufficientCards', () => {
      const armies = trader.getBestTrade(cards([INFANTRY]), bestResult);

      expect(armies).to.equal(0);
    });

    it('doesNotPopulateBestResultWhenNoMatch', () => {
      const armies = trader.getBestTrade(cards([INFANTRY, CAVALRY, INFANTRY, CAVALRY]), bestResult);

      expect(armies).to.equal(0);
    });
  });

  describe('fixed set mode', () => {
    // in fixed set mode
    beforeEach(() =>  {
      trader.setCardMode(CARD_FIXED_SET);
    });

    it('choosesHigherPoints', () => {
      const armies = trader.getBestTrade(uniqueCards(
              [CAVALRY, 0,
              INFANTRY, 1,
              INFANTRY, 2,
              INFANTRY, 3,
              CAVALRY, 4,
              CAVALRY, 5]), bestResult);

      expect(armies).to.equal(6);
      expect(cardTypes(bestResult)).to.deep.equal([CAVALRY, CAVALRY, CAVALRY]);
    });

    it('armiesIs6ForCavalrySet', () => {
      const armies = trader.getBestTrade(cards([CAVALRY, CAVALRY, CAVALRY]), bestResult);
      expect(armies).to.equal(6);
    });

    it('armiesIs4ForInfantrySet', () => {
      const armies = trader.getBestTrade(cards([INFANTRY, INFANTRY, INFANTRY]), bestResult);
      expect(armies).to.equal(4);
    });

    it('armiesIs8ForCannonSet', () => {
      const armies = trader.getBestTrade(cards([CANNON, CANNON, CANNON]), bestResult);
      expect(armies).to.equal(8);
    });

    it('allCardsDifferentWithWildcard', () => {
      const armies = trader.getBestTrade(cards([WILDCARD, INFANTRY, CANNON]), bestResult);
      expect(armies).to.equal(10);
    });

    it('allCardsDifferent', () => {
      const armies = trader.getBestTrade(cards([CAVALRY, INFANTRY, CANNON]), bestResult);
      expect(armies).to.equal(10);
    });

    it('twoWildcardsTreatedAsAllDifferent', () => {
      const armies = trader.getBestTrade(cards([CANNON, WILDCARD, WILDCARD]), bestResult);
      expect(armies).to.equal(10);
    });

    it('threeWildcardsNotReallyPossible', () => {
      const armies = trader.getBestTrade(cards([WILDCARD, WILDCARD, WILDCARD]), bestResult);
      expect(armies).to.equal(12);
    });
  });

  describe('italian mode', () => {
    beforeEach(() => {
      trader.setCardMode(CARD_ITALIANLIKE_SET);
    });

    it('allTheSameCavalry', () => {
      const armies = trader.getBestTrade(cards([CAVALRY, CAVALRY, CAVALRY]), bestResult);
      expect(armies).to.equal(8);
    });

    it('allTheSameInfantry', () => {
      const armies = trader.getBestTrade(cards([INFANTRY, INFANTRY, INFANTRY]), bestResult);
      expect(armies).to.equal(6);
    });

    it('allTheSameCannon', () => {
      const armies = trader.getBestTrade(cards([CANNON, CANNON, CANNON]), bestResult);
      expect(armies).to.equal(4);
    });

    it('allTheSameWildcard', () => {
      const armies = trader.getBestTrade(cards([WILDCARD, WILDCARD, WILDCARD]), bestResult);
      expect(armies).to.equal(0);
    });

    it('allTheSameWithOneWildcard', () => {
      const armies = trader.getBestTrade(cards([WILDCARD, CANNON, CANNON]), bestResult);
      expect(armies).to.equal(12);
    });

    it('twoWildcardsApparentlySuck', () => {
      const armies = trader.getBestTrade(cards([WILDCARD, WILDCARD, CANNON]), bestResult);
      expect(armies).to.equal(0);
    });

    it('choosesHigherPoints', () => {
      const armies = trader.getBestTrade(uniqueCards(
              [CAVALRY, 0,
              INFANTRY, 1,
              INFANTRY, 2,
              INFANTRY, 3,
              CAVALRY, 4,
              CAVALRY, 5]), bestResult);

      expect(armies).to.equal(8);
      expect(cardTypes(bestResult)).to.deep.equal([CAVALRY, CAVALRY, CAVALRY]);
    });
  });

  describe('in increasing mode', () => {
    beforeEach(() => {
      trader.setCardMode(CARD_INCREASING_SET);
    });

    it('increasesBy4WhenStateUnder4', () => {
      trader.setCardState(0);

      const armies = trader.getBestTrade(cards([CANNON, CANNON, CANNON]), bestResult);

      expect(armies).to.equal(0 + 4);
    });

    it('increasesBy2WhenStateUnder12', () => {
      trader.setCardState(4);

      const armies = trader.getBestTrade(cards([INFANTRY, INFANTRY, INFANTRY]), bestResult);

      expect(armies).to.equal(4 + 2);
    });

    it('increasesBy3WhenStateUnder15', () => {
      trader.setCardState(14);

      const armies = trader.getBestTrade(cards([INFANTRY, INFANTRY, INFANTRY]), bestResult);

      expect(armies).to.equal(14 + 3);
    });

    it('increasesBy5WhenState15OrMore', () => {
      trader.setCardState(15);

      const armies = trader.getBestTrade(cards([INFANTRY, INFANTRY, INFANTRY]), bestResult);

      expect(armies).to.equal(15 + 5);
    });

    it('chooses first matching type since points are same', () => {
      const cards = uniqueCards([
        CAVALRY, 0,
        INFANTRY, 1,
        INFANTRY, 2,
        INFANTRY, 3,
        CAVALRY, 4,
        CAVALRY, 5]);

      // Ugh
      const cardLookupTable = cardTable(cards);
      const firstTypeInLookupTable = Object.keys(cardLookupTable)[0];
      // Better solution: define a more deterministic iteration order in the prod code
      // (object key order could potentially differ based on platform)

      trader.getBestTrade(cards, bestResult);

      const expected = [firstTypeInLookupTable, firstTypeInLookupTable, firstTypeInLookupTable];
      expect(cardTypes(bestResult)).to.deep.equal(expected);
    });
  });

  const cardTable = cards => {
    let cardTypes = {};
    cards.forEach(card => {
      let cardType = cardTypes[card.type];
      if (!cardType) {
        cardType = [];
        cardTypes[card.type] = cardType;
      }
      cardType.push(card);
    });
    return cardTypes;
  }; // this same func exists in the prod code

  const cardTypes = cards => 
    cards.map(c => c.getType());

  const cards = cardNames => 
    cardNames.map(cardName => new Card(cardName));

  const uniqueCards = cardsAndIds => {
    const results = [];
    for (let i = 0; i < cardsAndIds.length; i += 2) {
        const type = cardsAndIds[i];
        const id = cardsAndIds[i + 1];
        results.push(new Card(type, id));
    }
    return results;
  };
});
