import { defineStore } from 'pinia'

export const useMembersStore = defineStore('members', {
  state: () => ({
    payer: null,       // { id, name } 결제자 1명
    participants: [],  // [{ id, name }, ...] 참여 멤버들
  }),

  actions: {
    setPayer(user) {
      this.payer = user
    },
    setParticipants(users) {
      this.participants = users
    },
    reset() {
      this.payer = null
      this.participants = []
    },
  },
})