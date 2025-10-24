export const getFormattedDateLabel = (date: string) => {
  const activityDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  activityDate.setHours(0, 0, 0, 0);

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (activityDate.getTime() === today.getTime()) {
    return `TODAY - ${formattedDate}`;
  } else if (activityDate.getTime() === yesterday.getTime()) {
    return `YESTERDAY - ${formattedDate}`;
  } else {
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const weekdayName = weekdays[activityDate.getDay()];
    return `${weekdayName} - ${formattedDate}`;
  }
};
