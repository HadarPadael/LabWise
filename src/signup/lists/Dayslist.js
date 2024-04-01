function DaysList() {
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  return days;
}

export default DaysList;
