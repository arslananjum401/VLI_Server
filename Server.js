const getWeekByWeekNumber = (weekNumber) => {
    const date = new Date();
    const currentMonthWeek = Math.ceil(date.getDate() / 7);

    const weekDiff = weekNumber - currentMonthWeek;
    const sunday = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + (weekDiff * 7) - date.getUTCDay()
    );

    console.log(sunday.getDate())
    const days = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(sunday);
        currentDay.setDate(sunday.getDate() + i);
        days.push({
            day: currentDay.toLocaleString('default', { weekday: 'long' }),
            date: currentDay.toLocaleDateString(),
        });
    }

    return days;
};
// const date = new Date();
// console.log(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5).getMonth())
const getCurrentWeekNumber = () => {
    const date = new Date();
    const dayOfYear = ((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 5) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000);
    return Math.ceil(dayOfYear / 7);
};

// console.log(getCurrentWeekNumber());

console.log(getWeekByWeekNumber(getCurrentWeekNumber()-1))