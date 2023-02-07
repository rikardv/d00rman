import {
  ADD_ITEM,
  DELETE_ITEM,
  IS_AT_HOME,
  START_GPS,
  UPDATE_POSITION,
  SIGN_IN,
  IS_AUTHENTICATED,
  DOORMAN_STATUS,
  TOGGLE_APARTMENT_DOOR,
  TOGGLE_MAIN_ENTRANCE_DOOR,
  SET_SESSION_ID,
  SET_COOKIE_TOKEN,
  SIGN_OUT,
  SET_AUTH_X,
  SYNCED,
  SYNCING,
  READY_FOR_GPS_TOGGLE,
  IS_AWAY,
  SHOW_MODAL,
  HIDE_MODAL,
  UPDATE_POSITION_STATE,
} from './actions';

const initialState = {
  skip: true,
  distanceToZone: 0,
  gpsOn: false,
  prevPosition: '',
  deskLightOn: false,
  floorLightOn: false,
  apartmentUnlocked: false,
  mainEntranceUnlocked: false,
  awaitingAuth: false,
  authenticated: false,
  syncing: false,
  synced: false,
  authX: '',
  sessionId: '',
  cookieToken: '',
  fgtServer: '',
  lowBattery: false,
  toggledAuth: false,
  showModal: false,
  modalText: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        numOfItems: state.numOfItems + 1,
      };

    case DELETE_ITEM:
      return {
        ...state,
        numOfItems: state.numOfItems - 1,
      };

    case START_GPS:
      return {
        ...state,
        gpsOn: action.payload,
      };

    case UPDATE_POSITION:
      return {
        ...state,
        distanceToZone: action.payload,
      };
    case SIGN_IN:
      return {
        ...state,
        toggledAuth: true,
        awaitingAuth: true,
        authenticated: false,
      };

    case IS_AUTHENTICATED:
      return {
        ...state,
        awaitingAuth: false,
        authenticated: true,
      };

    case DOORMAN_STATUS:
      return {
        ...state,
        apartmentUnlocked: !action.payload.IsClosedAndLocked,
        lowBattery: action.payload.BatteryLevelLow,
      };

    case TOGGLE_MAIN_ENTRANCE_DOOR:
      return {
        ...state,
        mainEntranceUnlocked: action.payload,
      };

    case TOGGLE_APARTMENT_DOOR:
      return {
        ...state,
        apartmentUnlocked: action.payload,
      };

    case SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.payload,
      };
    case SET_COOKIE_TOKEN:
      return {
        ...state,
        cookieToken: action.payload,
      };

    case SET_AUTH_X:
      return {
        ...state,
        authX: action.payload,
      };

    case SYNCED:
      return {
        ...state,
        synced: true,
        syncing: false,
      };

    case SYNCING:
      return {
        ...state,
        synced: false,
        syncing: true,
      };

    case SIGN_OUT:
      return {
        ...state,
        awaitingAuth: false,
        authenticated: false,
        syncing: false,
        synced: false,
        toggledAuth: false,
      };
    case READY_FOR_GPS_TOGGLE:
      return {
        ...state,
        skip: false,
      };
    case SHOW_MODAL:
      return {
        ...state,
        showModal: true,
        modalText: action.payload,
      };
    case HIDE_MODAL:
      return {
        ...state,
        showModal: false,
      };

    case UPDATE_POSITION_STATE: {
      return {
        ...state,
        prevPosition: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
