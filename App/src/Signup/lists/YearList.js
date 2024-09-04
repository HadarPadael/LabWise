function YearList() {
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1950,
    label: i + 1950,
  }));

  return years;
}

export default YearList;
