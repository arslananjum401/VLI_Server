// const getWeekByWeekNumber = (weekNumber) => {
//     const date = new Date();
//     const currentMonthWeek = Math.ceil(date.getDate() / 7);

//     const weekDiff = weekNumber - currentMonthWeek;
//     const sunday = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         date.getDate() + (weekDiff * 7) - date.getUTCDay()
//     );

//     // console.log(sunday.getDate()) 
//     const days = []; 
//     for (let i = 0; i < 7; i++) {
//         const currentDay = new Date(sunday); 
//         currentDay.setDate(sunday.getDate() + i); 
//         days.push({
//             day: currentDay.toLocaleString('default', { weekday: 'long' }),
//             date: currentDay.toLocaleDateString(),
//         });
//     }

//     return days;
// };
// // const date = new Date();
// // console.log(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5).getMonth())
// const getCurrentWeekNumber = () => {
//     const date = new Date();
//     const dayOfYear = ((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 5) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000);
//     return Math.ceil(dayOfYear / 7);
// };

// console.log(getCurrentWeekNumber());

// console.log(getWeekByWeekNumber(getCurrentWeekNumber()))


const today = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Get the current day of the week (as a number)
const currentDayOfWeek = today.getDay();

// Calculate the date of the Sunday at the start of the current week
const sunday = new Date(today);
sunday.setDate(today.getDate() - currentDayOfWeek);

// Create an array to hold the dates and days of the current week
const week = [];

// Loop through the week, adding each date and day to the array
for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dayOfWeek = daysOfWeek[date.getDay()];
    week.push({ date: date.getDate(), month: date.getMonth(), year: date.getFullYear(), dayOfWeek: dayOfWeek });
}

// console.log(`The dates and days of the current week are:`);
// console.table(week);
