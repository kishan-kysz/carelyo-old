import { GlobalState } from 'little-state-machine'

export function setActiveConsultation(state: GlobalState, payload: boolean) {
  return {
    ...state,
    hasActiveConsultation: payload,
  }
}

export function showAlert(state: GlobalState, payload: boolean) {
  return {
    ...state,
    showAlert: payload,
  }
}

export function setRoomName(state: GlobalState, payload: string) {
  return {
    ...state,
    roomName: payload,
  }
}
export function setSbarNotes(state: GlobalState, payload: string) {
  return {
    ...state,
    sbar: {
      ...state.sbar,
      notes: payload,
    },
  }
}
export function setSbar(
  state: GlobalState,
  payload: { key: keyof GlobalState['sbar']; value: string }[],
) {
  return {
    ...state,
    sbar: {
      ...state.sbar,
      ...payload,
    },
  }
}

export function resetSbar(state: GlobalState) {
  return {
    ...state,
    sbar: {
      situation: '',
      background: '',
      assessment: '',
      diagnosis: '',
      notes: '',
      recommendation: '',
    },
  }
}

export function addDiagnosis(
  state: GlobalState,
  payload: { key: string; value: string },
) {
  return {
    ...state,
    diagnosis: { ...payload },
  }
}
