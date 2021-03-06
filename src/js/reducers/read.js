import fetch from "../fetch";

export const READ_LOAD_DONE = "READ_LOAD_DONE";
export const READ_ADD = "READ_ADD";

export function readLoaded(read) {
  return { type: READ_LOAD_DONE, read };
}

export function readLoadError(error) {
  return { type: READ_LOAD_DONE, error };
}

export function markRead(book) {
  return dispatch => {
    return fetch(`read/${book}`, { method: "POST" })
      .then(response => {
        dispatch(readLoaded(response));
      })
      .catch(error => {
        dispatch(readLoadError(error.message));
      });
  };
}

export function loadRead() {
  return dispatch => {
    return fetch("read")
      .then(response => {
        dispatch(readLoaded(response));
      })
      .catch(error => {
        dispatch(readLoadError(error.message));
      });
  };
}

export function isRead(list, path) {
  return list.indexOf(path) > -1;
}

const defaultState = {
  read: []
};

export default function booksReducer(state = defaultState, action) {
  if (action.type !== READ_LOAD_DONE) {
    return state;
  }

  return { ...state, read: action.read };
}
