import 'little-state-machine'

declare module 'little-state-machine' {
  interface GlobalState {
    hasActiveConsultation: boolean
    roomName: string
    showAlert: boolean
    preJoin: number
    maxDuration: number
    sbar: {
      situation: string
      background: string
      assessment: string
      diagnosis: string
      notes: string
      recommendation: string
    }
  }
}
