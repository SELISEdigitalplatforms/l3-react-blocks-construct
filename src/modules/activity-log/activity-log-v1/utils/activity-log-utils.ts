export const getFormattedDateLabel = (date: string) => {
  const activityDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const normalizedYesterday = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );
  const normalizedActivityDate = new Date(
    activityDate.getFullYear(),
    activityDate.getMonth(),
    activityDate.getDate()
  );

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (normalizedActivityDate.getTime() === normalizedToday.getTime()) {
    return `TODAY - ${formattedDate}`;
  } else if (normalizedActivityDate.getTime() === normalizedYesterday.getTime()) {
    return `YESTERDAY - ${formattedDate}`;
  } else {
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const weekdayName = weekdays[activityDate.getDay()];
    return `${weekdayName} - ${formattedDate}`;
  }
};
