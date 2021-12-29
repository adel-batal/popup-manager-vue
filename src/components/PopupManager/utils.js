export function getFormattedDate(date = Date.now()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return `${day}-${month}-${year}`;
}
