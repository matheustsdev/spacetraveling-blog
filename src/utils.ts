export function formatDate(date: string): string {
  const newDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const dateFormatted = `${newDate.slice(0, 2)} ${
    newDate.charAt(6).toLocaleUpperCase() + newDate.slice(7, 9)
  } ${newDate.slice(14, 18)}`;

  return dateFormatted;
}
