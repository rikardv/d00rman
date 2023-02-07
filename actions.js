export const START_GPS = 'START_GPS';
export const UPDATE_POSITION = 'UPDATE_POSITION';
export const IS_AT_HOME = 'IS_AT_HOME';
export const IS_AWAY = 'IS_AWAY';
export const SIGN_IN = 'SIGN_IN';
export const IS_AUTHENTICATED = 'IS_AUTHENTICATED';
export const SYNCING = 'SYNCING';
export const SYNCED = 'SYNCED';
export const DOORMAN_STATUS = 'DOORMAN_STATUS';
export const SET_AUTH_X = 'SET_AUTH_X';
export const TOGGLE_MAIN_ENTRANCE_DOOR = 'TOGGLE_MAIN_ENTRANCE_DOOR';
export const TOGGLE_APARTMENT_DOOR = 'TOGGLE_APARTMENT_DOOR';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_COOKIE_TOKEN = 'SET_COOKIE_ID';
export const SIGN_OUT = 'SIGN_OUT';
export const READY_FOR_GPS_TOGGLE = 'READY_FOR_GPS_TOGGLE';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const UPDATE_POSITION_STATE = 'UPDATE_POSITION_STATE';
export const startGps = e => {
  return {
    type: START_GPS,
    payload: e,
  };
};

export const updatePos = e => {
  return {
    type: UPDATE_POSITION,
    payload: e,
  };
};

export const isAtHome = () => {
  return {
    type: IS_AT_HOME,
  };
};

export const isAway = () => {
  return {
    type: IS_AWAY,
  };
};

export const updatePositionState = e => {
  return {
    type: UPDATE_POSITION_STATE,
    payload: e,
  };
};

export const signIn = e => {
  return {
    type: SIGN_IN,
    payload: e,
  };
};

export const isAuthenticated = () => {
  return {
    type: IS_AUTHENTICATED,
  };
};

export const syncing = () => {
  return {
    type: SYNCING,
  };
};

export const synced = () => {
  return {
    type: SYNCED,
  };
};

export const doormanStatus = data => {
  return {
    type: DOORMAN_STATUS,
    payload: data,
  };
};

export const setAuthX = auth => {
  return {
    type: SET_AUTH_X,
    payload: auth,
  };
};

export const setSessionId = session => {
  return {
    type: SET_SESSION_ID,
    payload: session,
  };
};

export const setCookieToken = cookie => {
  return {
    type: SET_COOKIE_TOKEN,
    payload: cookie,
  };
};

export const toggleMainEntranceDoor = e => {
  return {
    type: TOGGLE_MAIN_ENTRANCE_DOOR,
    payload: e,
  };
};

export const toggleApartmentDoor = e => {
  return {
    type: TOGGLE_APARTMENT_DOOR,
    payload: e,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const readyForGpsToggle = () => {
  return {
    type: READY_FOR_GPS_TOGGLE,
  };
};

export const showModal = text => {
  return {
    type: SHOW_MODAL,
    payload: text,
  };
};

export const hideModal = () => {
  return {
    type: HIDE_MODAL,
  };
};
