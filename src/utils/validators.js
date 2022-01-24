import { GAME_LIMITS } from "constants/values";


const validName = (name) => {
    return name.length >= GAME_LIMITS.NAME_LENGTH_MIN || name.length <= GAME_LIMITS.NAME_LENGTH_MAX;
}

const validNumberList = (list) => {
    const len = list.length;

    // no of cards
    if (len < GAME_LIMITS.CARDS_QTY_MIN || len > GAME_LIMITS.CARDS_QTY_MAX) return false;

    // duplicacy in cards
    if (new Set(list).size !== len) return false;

    // validate each entry
    for (let i = 0; i < len; i++) {
        const x = list[i];

        // valid decimal number
        let arr = String(x).split('.');
        if (arr.length > 2) return false;
        else if (arr.length == 2 && arr[1].length > GAME_LIMITS.CARD_DECIMAL_DIGITS_MAX) return false;

        // valid range
        if (!(x && Number.isFinite(x) && x >= GAME_LIMITS.CARD_VALUE_MIN && x <= GAME_LIMITS.CARD_VALUE_MAX)) return false;
    }

    return true;
};

const validDuration = (duration) => {
    return Number.isInteger(duration) && duration >= GAME_LIMITS.DURATION_MIN &&
        duration <= GAME_LIMITS.DURATION_MAX;
};

const validRange = (from, to) => {
    return from && Number.isInteger(from) && from >= GAME_LIMITS.CARD_VALUE_MIN && from <= GAME_LIMITS.CARD_VALUE_MAX
        && to && Number.isInteger(to) && to >= GAME_LIMITS.CARD_VALUE_MIN && to <= GAME_LIMITS.CARD_VALUE_MAX && from <= to;
};

const validIntegerList = (list) => {
    for (let i = 0; i < list.length; i++) if (!Number.isInteger(list[i])) return false;
    return true;
};

export { validName, validNumberList, validDuration, validRange, validIntegerList };
