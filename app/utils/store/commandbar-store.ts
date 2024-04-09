import { create } from 'zustand'

interface CommandMenuStore {
  isOpen: boolean
  toggle: (initialState?: boolean) => void
}

export const useCommandMenuStore = create<CommandMenuStore>()(set => ({
  isOpen: false,
  toggle: initialState =>
    set(state => ({
      isOpen: initialState ? initialState : !state.isOpen,
    })),
}))
