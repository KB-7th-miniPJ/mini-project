import { defineStore } from "pinia";

export const useExpensedetailsStore = defineStore('expensedetail',{
    state:()=>({
        detailData:null
    }),

    actions:{
        setdetailsData(data){
            this.detailData = data
        },
        getdetailsData(){
            return this.detailData
        },
        resetdetailData(){
            this.detailData = null
        }
    }
})