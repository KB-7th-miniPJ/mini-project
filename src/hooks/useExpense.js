import {reactive} from 'vue'
import {getTravelMembers} from '../api/expenseApi'

export const useExpense = () => {
    const state = reactive({
        members:[],
        payer:null,
        selectedMembers:[]
    })

    const fetchMembers = async (travelId) => {
        state.members = await getTravelMembers(travelId)
    }

    return { state, fetchMembers}
}