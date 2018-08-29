export const CAVALRY = 'Cavalry';
export const INFANTRY = 'Infantry';
export const CANNON = 'Cannon';
export const WILDCARD = 'wildcard';

class Card {
  constructor(type, countryIndex = -1) {
    if (type !== CAVALRY && type !== INFANTRY && type !== CANNON && type !== WILDCARD) {
        throw new Error('trying to make a card with an unknown type: ' + type);
    }
    this.type = type;
    this.countryIndex = countryIndex;
  }

  getCountryIndex() {
    return this.countryIndex;
  }

  getType() {
    return this.type;
  }

  toString() {
    return `${this.type}-${this.countryIndex}`;
  }

  equals(otherCard) {
    if (this.countryIndex != otherCard.countryIndex) return false;
    return this.type === otherCard.type;
  }
}

export default Card;
