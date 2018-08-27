package cards;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Trader {
    public final static int CARD_INCREASING_SET = 0;
    public final static int CARD_FIXED_SET = 1;
    public final static int CARD_ITALIANLIKE_SET = 2;

    private int cardState;
    private int cardMode;

    public int getBestTrade(List<Card> cards, Card[] bestResult) {
        Map<String, List<Card>> cardTypes = new HashMap<String, List<Card>>();
        for (Card card : cards) {
            List<Card> cardType = cardTypes.get(card.getType());
            if (cardType == null) {
                cardType = new ArrayList<Card>();
                cardTypes.put(card.getType(), cardType);
            }
            cardType.add(card);
        }
        List<Card> type3 = null;
        List<Card> type2 = null;
        List<Card> type1 = null;
        type3 = cardTypes.get(Card.CANNON);
        type2 = cardTypes.get(Card.CAVALRY);
        type1 = cardTypes.get(Card.INFANTRY);
        Card carda = null;
        Card cardb = null;
        Card cardc = null;
        int bestValue = 0;
        if (cardTypes.size() >= 3) {
            carda = (type3 != null) ? type3.get(0) : null;
            if (carda == null) {
                List<Card> type = cardTypes.get(Card.WILDCARD);
                carda = (type != null) ? type.get(0) : null;
            }
            cardb = (type2 != null) ? type2.get(0) : null;
            if (cardb == null) {
                List<Card> type = cardTypes.get(Card.WILDCARD);
                cardb = (type != null) ? type.get(0) : null;
            }
            cardc = (type1 != null) ? type1.get(0) : null;
            if (cardc == null) {
                List<Card> type = cardTypes.get(Card.WILDCARD);
                cardc = (type != null) ? type.get(0) : null;
            }

            String c1 = carda.getType();
            String c2 = cardb.getType();
            String c3 = cardc.getType();

            int cardMode1 = cardMode;
            int armies = 0;

            // we shift all wildcards to the front
            if (!c1.equals(Card.WILDCARD)) {
                String n4 = c3;
                c3 = c1;
                c1 = n4;
            }
            if (!c2.equals(Card.WILDCARD)) {
                String n4 = c3;
                c3 = c2;
                c2 = n4;
            }
            if (!c1.equals(Card.WILDCARD)) {
                String n4 = c2;
                c2 = c1;
                c1 = n4;
            }

            if (cardMode1 == CARD_INCREASING_SET) {
                if (
                        c1.equals(Card.WILDCARD) ||
                        (c1.equals(c2) && c1.equals(c3)) ||
                        (!c1.equals(c2) && !c1.equals(c3) && !c2.equals(c3))
                        ) {
                    int result;

                    if (cardState < 4) {
                        result = cardState + 4;
                    } else if (cardState < 12) {
                        result = cardState + 2;
                    } else if (cardState < 15) {
                        result = cardState + 3;
                    } else {
                        result = cardState + 5;
                    }

                    armies = result;
                }
            } else if (cardMode1 == CARD_FIXED_SET) {
                // ALL THE SAME or 'have 1 wildcard and 2 the same'
                if ((c1.equals(c2) || c1.equals(Card.WILDCARD)) && c2.equals(c3)) {
                    if (c3.equals(Card.INFANTRY)) {
                        armies = 4;
                    } else if (c3.equals(Card.CAVALRY)) {
                        armies = 6;
                    } else if (c3.equals(Card.CANNON)) {
                        armies = 8;
                    } else { // (c1.equals( Card.WILDCARD ))
                        armies = 12; // Incase someone puts 3 wildcards into his set
                    }
                }
                // ALL CARDS ARE DIFFERENT (can have 1 wildcard) or 2 wildcards and a 3rd card
                else if (
                        (c1.equals(Card.WILDCARD) && c2.equals(Card.WILDCARD)) ||
                        (!c1.equals(c2) && !c2.equals(c3) && !c1.equals(c3))
                        ) {
                    armies = 10;
                }
            } else { // (cardMode==CARD_ITALIANLIKE_SET)
                if (c1.equals(c2) && c1.equals(c3)) {
                    // All equal
                    if (c1.equals(Card.CAVALRY)) {
                        armies = 8;
                    } else if (c1.equals(Card.INFANTRY)) {
                        armies = 6;
                    } else if (c1.equals(Card.CANNON)) {
                        armies = 4;
                    } else { // (c1.equals( Card.WILDCARD ))
                        armies = 0; // Incase someone puts 3 wildcards into his set
                    }
                } else if (!c1.equals(c2) && !c2.equals(c3) && !c1.equals(c3) && !c1.equals(Card.WILDCARD)) {
                    armies = 10;
                }
                //All the same w/1 wildcard
                else if (c1.equals(Card.WILDCARD) && c2.equals(c3)) {
                    armies = 12;
                }
                //2 wildcards, or a wildcard and two different
                else {
                    armies = 0;
                }
            }
            bestValue = armies;
            if (bestValue > 0) {
                if (bestResult == null) {
                    return bestValue;
                }
                bestResult[0] = carda;
                bestResult[1] = cardb;
                bestResult[2] = cardc;
            }
        }
        List<Card> wildCards = cardTypes.get(Card.WILDCARD);
        int wildCardCount = wildCards == null ? 0 : wildCards.size();
        for (Map.Entry<String, List<Card>> entry : cardTypes.entrySet()) {
            carda = null;
            if (entry.getKey().equals(Card.WILDCARD)) {
                if (wildCardCount >= 3) {
                    carda = wildCards.get(0);
                    cardb = wildCards.get(1);
                    cardc = wildCards.get(2);
                }
            } else {
                List<Card> cardList = entry.getValue();
                if (cardList.size() + wildCardCount >= 3) {
                    carda = cardList.get(0);
                    cardb = cardList.size() > 1 ? cardList.get(1) : wildCards.get(0);
                    cardc = cardList.size() > 2 ? cardList.get(2) : wildCards.get(2 - cardList.size());
                }
            }
            if (carda != null) {
                String c1 = carda.getType();
                String c2 = cardb.getType();
                String c3 = cardc.getType();
                int cardMode1 = cardMode;
                int armies = 0;

                // we shift all wildcards to the front
                if (!c1.equals(Card.WILDCARD)) {
                    String n4 = c3;
                    c3 = c1;
                    c1 = n4;
                }
                if (!c2.equals(Card.WILDCARD)) {
                    String n4 = c3;
                    c3 = c2;
                    c2 = n4;
                }
                if (!c1.equals(Card.WILDCARD)) {
                    String n4 = c2;
                    c2 = c1;
                    c1 = n4;
                }

                if (cardMode1 == CARD_INCREASING_SET) {
                    if (
                            c1.equals(Card.WILDCARD) ||
                            (c1.equals(c2) && c1.equals(c3)) ||
                            (!c1.equals(c2) && !c1.equals(c3) && !c2.equals(c3))
                            ) {
                        int result;

                        if (cardState < 4) {
                            result = cardState + 4;
                        } else if (cardState < 12) {
                            result = cardState + 2;
                        } else if (cardState < 15) {
                            result = cardState + 3;
                        } else {
                            result = cardState + 5;
                        }

                        armies = result;
                    }
                } else if (cardMode1 == CARD_FIXED_SET) {
                    // ALL THE SAME or 'have 1 wildcard and 2 the same'
                    if ((c1.equals(c2) || c1.equals(Card.WILDCARD)) && c2.equals(c3)) {
                        if (c3.equals(Card.INFANTRY)) {
                            armies = 4;
                        } else if (c3.equals(Card.CAVALRY)) {
                            armies = 6;
                        } else if (c3.equals(Card.CANNON)) {
                            armies = 8;
                        } else { // (c1.equals( Card.WILDCARD ))
                            armies = 12; // Incase someone puts 3 wildcards into his set
                        }
                    }
                    // ALL CARDS ARE DIFFERENT (can have 1 wildcard) or 2 wildcards and a 3rd card
                    else if (
                            (c1.equals(Card.WILDCARD) && c2.equals(Card.WILDCARD)) ||
                            (!c1.equals(c2) && !c2.equals(c3) && !c1.equals(c3))
                            ) {
                        armies = 10;
                    }
                } else { // (cardMode==CARD_ITALIANLIKE_SET)
                    if (c1.equals(c2) && c1.equals(c3)) {
                        // All equal
                        if (c1.equals(Card.CAVALRY)) {
                            armies = 8;
                        } else if (c1.equals(Card.INFANTRY)) {
                            armies = 6;
                        } else if (c1.equals(Card.CANNON)) {
                            armies = 4;
                        } else { // (c1.equals( Card.WILDCARD ))
                            armies = 0; // Incase someone puts 3 wildcards into his set
                        }
                    } else if (!c1.equals(c2) && !c2.equals(c3) && !c1.equals(c3) && !c1.equals(Card.WILDCARD)) {
                        armies = 10;
                    }
                    //All the same w/1 wildcard
                    else if (c1.equals(Card.WILDCARD) && c2.equals(c3)) {
                        armies = 12;
                    }
                    //2 wildcards, or a wildcard and two different
                    else {
                        armies = 0;
                    }
                }
                int val = armies;
                if (val > bestValue) {
                    bestValue = val;
                    if (bestResult == null) {
                        return bestValue;
                    }
                    bestResult[0] = carda;
                    bestResult[1] = cardb;
                    bestResult[2] = cardc;
                }
            }
        }
        return bestValue;
    }

    // for test

    void setCardMode(int cardMode) {
        this.cardMode = cardMode;
    }

    void setCardState(int cardState) {
        this.cardState = cardState;
    }
}
