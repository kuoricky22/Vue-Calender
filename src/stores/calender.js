import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useCalenderStore = defineStore('calender', () => {
    const year = ref(new Date().getFullYear());
    const month = ref(new Date().getMonth() + 1);
    const weekName = ref(["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"])
    const daysTable = ref([]);


    function setMonthDays(){
        const currMonth = getMonthDetail(year.value, month.value)
        const prevMonth = getMonthDetail(year.value, month.value - 1)
        const nextMonth = getMonthDetail(year.value, month.value + 1)

        const lastDateMonth = currMonth[currMonth.length - 1]
        const startDay = getDateDay(new Date(year.value, month.value - 1, 1))
        const endDay = getDateDay(new Date(year.value, month.value - 1, lastDateMonth))

        const prevMonthAddOn = prevMonth.slice(prevMonth.length - startDay)
        const mextMonthAddOn = nextMonth.slice(0, 6 - endDay)

        const currMonthArr = currMonth.map(date => dateToString(date))
        const prevMonthAddOnArr = prevMonthAddOn.map(date => dateToString(date))
        const mextMonthAddOnArr = mextMonthAddOn.map(date => dateToString(date))

        daysTable.value = prevMonthAddOnArr.map(date => ({date, today: false, disabled: true}))
        .concat(currMonthArr.map(function (date){
            let obj = {};
  			obj["date"] = date
  			detectIsToday(date) ? obj["today"] = true:obj["today"] = false
  			obj["disable"] = false
            return obj
        }))
        .concat(mextMonthAddOnArr.map(date => ({date, today: false, disabled: true})))
    }

    function nextMonth(){
        month.value++
        if(month.value > 12){
            month.value = 1;
            year.value++;
        }
        setMonthDays()
    }

    function preMonth(){
        month.value--
        if(month.value < 1){
            month.value = 12;
            year.value--;
        }
        setMonthDays()
    }

    function getDateDay(d) {
        return d.getDay();
    }

    function getMonthDetail(year, month){
        const lastDate = new Date(year, month, 0).getDate();
        return Array(lastDate).fill().map((_, key) => key + 1)
    }

    function dateToString(date){
        return date.toString().padStart(2, '0');
    }
    function detectIsToday(date){
        const inputDate = new Date(year.value, month.value - 1, date).toDateString()
        const today = new Date().toDateString();
        return inputDate === today ? true : false
    }

    return{year, month, weekName, daysTable, nextMonth, preMonth, setMonthDays}
})