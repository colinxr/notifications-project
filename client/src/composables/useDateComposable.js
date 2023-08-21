import { ref, onBeforeMount } from "vue"

export function useDate() {
  const date = ref(null)

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ]

  const getReadableDate = value => {
    const dateString = new Date(value)

    const month = MONTHS[dateString.getMonth()]
    const day = dateString.getDate()
    const year = dateString.getFullYear()

    return `${month} ${day}, ${year}`
  }

  return {
    date,
    getReadableDate,
  }
}
