import { CANNON, CAVALRY, INFANTRY, WILDCARD } from './Card';

export const CARD_INCREASING_SET = 0;
export const CARD_FIXED_SET = 1;
export const CARD_ITALIANLIKE_SET = 2;

class Trader {
  constructor() { 
    this.cardState = 0; 
  }

  getBestTrade(cards, bestResult) {
    let cardTypes = {};
    cards.forEach(card => {
      let cardType = cardTypes[card.type];
      if (!cardType) {
        cardType = [];
        cardTypes[card.type] = cardType;
      }
      cardType.push(card);
    });

    let type3 = undefined;
    let type2 = undefined;
    let type1 = undefined;
    type3 = cardTypes[CANNON];
    type2 = cardTypes[CAVALRY];
    type1 = cardTypes[INFANTRY];
    let carda = undefined;
    let cardb = undefined;
    let cardc = undefined;

    let bestValue = 0;

    if (Object.keys(cardTypes).length >= 3) { // at least 3 diff types
      carda = type3 ? type3[0] : undefined;
      if (!carda) {
        const type = cardTypes[WILDCARD];
        carda = type ? type[0] : undefined;
      }
      cardb = type2 ? type2[0] : undefined;
      if (!cardb) {
        const type = cardTypes[WILDCARD];
        cardb = type ? type[0] : undefined;
      }
      cardc = type1 ? type1[0] : undefined;
      if (!cardc) {
        const type = cardTypes[WILDCARD];
        cardc = type ? type[0] : undefined;
      }

      let c1 = carda.type;
      let c2 = cardb.type;
      let c3 = cardc.type;

      let cardMode1 = this.cardMode;
      let armies = 0;

      // we shift all wildcards to the front
      if (c1 !== WILDCARD) {
        let n4 = c3;
        c3 = c1;
        c1 = n4;
      }
      if (c2 !== WILDCARD) {
        let n4 = c3;
        c3 = c2;
        c2 = n4;
      }
      if (c1 !== WILDCARD) {
        let n4 = c2;
        c2 = c1;
        c1 = n4;
      }

      if (cardMode1 === CARD_INCREASING_SET) {
        if (c1 === WILDCARD ||
            (c1 === c2 && c1 === c3) ||
            (c1 !== c2 && c1 !== c3 && c2 !== c3)) {
          let result;

          if (this.cardState < 4) {
              result = this.cardState + 4;
          } else if (this.cardState < 12) {
              result = this.cardState + 2;
          } else if (this.cardState < 15) {
              result = this.cardState + 3;
          } else {
              result = this.cardState + 5;
          }

          armies = result;
        }
      } else if (cardMode1 === CARD_FIXED_SET) {
        // ALL THE SAME or 'have 1 wildcard and 2 the same'
        if ((c1 === c2 || c1 === WILDCARD) && c2 === c3) {
          if (c3 === INFANTRY) {
            armies = 4;
          } else if (c3 === CAVALRY) {
            armies = 6;
          } else if (c3 === CANNON) {
            armies = 8;
          } else { // c1 === WILDCARD
            armies = 12; // Incase someone puts 3 wildcards into his set
          }
        }
        // ALL CARDS ARE DIFFERENT (can have 1 wildcard) or 2 wildcards and a 3rd card
        else if ((c1 === WILDCARD && c2 === WILDCARD) ||
                (c1 !== c2 && c2 !== c3 && c1 !== c3)) {
          armies = 10;
        }
      } else { // (cardMode==CARD_ITALIANLIKE_SET)
        if (c1 === c2 && c1 === c3) {
          // All equal
          if (c1 === CAVALRY) {
            armies = 8;
          } else if (c1 === INFANTRY) {
            armies = 6;
          } else if (c1 === CANNON) {
            armies = 4;
          } else { // c1 ===  WILDCARD
            armies = 0; // Incase someone puts 3 wildcards into his set
          }
        } else if (c1 !== c2 && c2 !== c3 && c1 !== c3 && c1 !== WILDCARD) {
          armies = 10;
        }
        //All the same w/1 wildcard
        else if (c1 === WILDCARD && c2 === c3) {
          armies = 12;
        }
        //2 wildcards, or a wildcard and two different
        else {
          armies = 0;
        }
      }
      bestValue = armies;
      if (bestValue > 0) {
        if (!bestResult) {
          return bestValue;
        }
        bestResult[0] = carda;
        bestResult[1] = cardb;
        bestResult[2] = cardc;
      }
    }
    let wildCards = cardTypes[WILDCARD];
    let wildCardCount = !wildCards ? 0 : wildCards.length;
    Object.keys(cardTypes).forEach(cardType => {
      const cardsForType = cardTypes[cardType];
      carda = undefined;
      if (cardType === WILDCARD) {
        if (wildCardCount >= 3) {
          carda = wildCards[0];
          cardb = wildCards[1];
          cardc = wildCards[2];
        }
      } else {
        if (cardsForType.length + wildCardCount >= 3) {
          carda = cardsForType[0];
          cardb = cardsForType.length > 1 ? cardsForType[1] : wildCards[0];
          cardc = cardsForType.length > 2 ? cardsForType[2] : wildCards[2 - cardsForType.length];
        }
      }
      if (carda) {
        let c1 = carda.type;
        let c2 = cardb.type;
        let c3 = cardc.type;
        let cardMode1 = this.cardMode;
        let armies = 0;

        // we shift all wildcards to the front
        if (c1 !== WILDCARD) {
          let n4 = c3;
          c3 = c1;
          c1 = n4;
        }
        if (c2 !== WILDCARD) {
          let n4 = c3;
          c3 = c2;
          c2 = n4;
        }
        if (c1 !== WILDCARD) {
          let n4 = c2;
          c2 = c1;
          c1 = n4;
        }


        if (cardMode1 == CARD_INCREASING_SET) {

          if (c1 === WILDCARD ||
              (c1 === c2 && c1 === c3) ||
              (c1 !== c2 && c1 !== c3 && c2 !== c3)) {
            let result;

            if (this.cardState < 4) {
              result = this.cardState + 4;
            } else if (this.cardState < 12) {
              result = this.cardState + 2;
            } else if (this.cardState < 15) {
              result = this.cardState + 3;
            } else {
              result = this.cardState + 5;
            }

            armies = result;
          }
        } else if (cardMode1 === CARD_FIXED_SET) {
          // ALL THE SAME or 'have 1 wildcard and 2 the same'
          if ((c1 === c2 || c1 === WILDCARD) && c2 === c3) {
            if (c3 === INFANTRY) {
              armies = 4;
            } else if (c3 === CAVALRY) {
              armies = 6;
            } else if (c3 === CANNON) {
              armies = 8;
            } else { // c1 === WILDCARD
              armies = 12; // Incase someone puts 3 wildcards into his set
            }
          }
          // ALL CARDS ARE DIFFERENT (can have 1 wildcard) or 2 wildcards and a 3rd card
          else if ((c1 === WILDCARD && c2 === WILDCARD) ||
            (!c1 !== c2 && !c2 !== c3 && !c1 !== c3)) {
            armies = 10;
          }
        } else { // (cardMode===CARD_ITALIANLIKE_SET)
            if (c1 === c2 && c1 === c3) {
              // All equal
              if (c1 === CAVALRY) {
                armies = 8;
              } else if (c1 === INFANTRY) {
                armies = 6;
              } else if (c1 === CANNON) {
                armies = 4;
              } else { // c1 ===  WILDCARD
                armies = 0; // Incase someone puts 3 wildcards into his set
              }
            } else if (c1 !== c2 && c2 !== c3 && c1 !== c3 && !c1 === WILDCARD) {
              armies = 10;
            }
            //All the same w/1 wildcard
            else if (c1 === WILDCARD && c2 === c3) {
              armies = 12;
            }
            //2 wildcards, or a wildcard and two different
            else {
              armies = 0;
            }
        }
        let val = armies;
        if (val > bestValue) {
          bestValue = val;
          if (!bestResult) {
            return bestValue;
          }
          bestResult[0] = carda;
          bestResult[1] = cardb;
          bestResult[2] = cardc;
        }
      }
    });
    return bestValue;
  }

  // for test

  setCardMode(cardMode) {
    this.cardMode = cardMode;
  }

  setCardState(cardState) {
    this.cardState = cardState;
  }
}

export default Trader;