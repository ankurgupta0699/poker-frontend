export const index = {
  toastTimeout: 3500,
};

export const RESPONSE_STATUS = {
  ERROR: 400,
};

export const INVITATION_PURPOSE = {
  SIGNUP: 0,
  GROUP: 1,
  POKERBOARD: 2,
};

export const GROUP_INVITE_STATUS = {
  0: "PENDING",
  1: "ACCEPTED",
  2: "DECLINED",
  3: "CANCELLED",
};

export const GROUP_INVITATION_STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  DECLINED: 2,
  CANCELLED: 3,
};

export const ESTIMATE_TYPE = {
  FIBONACCI: 0,
  ODD: 1,
  EVEN: 2,
  SERIAL: 3,
  CUSTOM: 4,
};

export const GAME_VALUES = {
  MIN_SIZE: 0,
  MAX_NAME_SIZE: 50,
  DEFAULT_DURATION: 20,
  DEFAULT_ESTIMATE_TYPE: 0,
};

export const USER_ROLE = {
  PLAYER: 0,
  SPECTATOR: 1,
};

export const USER_ROLE1 = {
  0: 'PLAYER',
  1: 'SPECTATOR',
}

export const POKER_INVITES_CATEGORY = {
  ALL: 'all',
  SENT: 'sent',
  RECEIVED: 'received',
}

export const POKER_INVITES_SUBCATEGORY = {
  ALL: 'all',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
}

export const POKER_CATEGORY = {
  ALL: 'all',
  OWNED: 'owned',
  PARTICIPATING: 'participating',
}

export const REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const GAME_LIMITS = {
  DURATION_MIN: 1,
  DURATION_MAX: 86400,
  CARDS_QTY_MIN: 1,
  CARDS_QTY_MAX: 52,
  CARD_VALUE_MIN: 0.001,
  CARD_VALUE_MAX: 1e+14,
  CARD_DECIMAL_DIGITS_MAX: 3,
  NAME_LENGTH_MIN: 1,
  NAME_LENGTH_MAX: 50,
}

export const FETCH_TICKETS_METHOD = {
  ISSUE: "issue",
  SPRINT: "sprint",
  JQL: "jql",
}
