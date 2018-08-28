class Card {
  const CAVALRY = 'Cavalry';
  const INFANTRY = 'Infantry';
  const CANNON = 'Cannon';
  const WILDCARD = 'wildcard';

  Card(type, countryIndex = -1) {
    if (type !== CAVALRY && type !== INFANTRY && type !== CANNON && type !== WILDCARD)) {
        throw new Error('trying to make a card with an unknown type: ' + type);
    }
    this.type = type;
    this.countryIndex = countryIndex;
  }

  getCountryIndex() {
    return countryIndex;
  }

  getType() {
    return type;
  }

  toString() {
    return type;
  }

  equals(otherCard) {
    if (this.countryIndex != otherCard.countryIndex) return false;
    return this.type === otherCard.type;
  }
}
