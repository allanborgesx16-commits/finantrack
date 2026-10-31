export const categories = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Contas', 'Outros'],
};
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseMoney(value) {
  let text = String(value).trim().replace(/\s|R\$/g, '');
  if (text.includes(',')) text = text.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  const cents = Math.round(Number(text) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 999999999999 ? cents / 100 : null;
}
export function totals(rows) {
  const income = rows.filter(t => t.type === 'income').reduce((sum, t) => sum + Math.round(Number(t.amount) * 100), 0);
  const expense = rows.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.round(Number(t.amount) * 100), 0);
  return { income: income / 100, expense: expense / 100, balance: (income - expense) / 100 };
}
export function monthRows(rows, month) { return rows.filter(t => t.date.slice(0, 7) === month); }
export function shiftMonth(month, delta) {
  const [year, m] = month.split('-').map(Number);
  return localDate(new Date(year, m - 1 + delta, 1)).slice(0, 7);
}
export function csv(rows) {
  const escape = value => `"${(/^[\s]*[=+\-@\t\r]/.test(String(value)) ? "'" : '') + String(value).replace(/"/g, '""')}"`;
  return '\uFEFF' + [['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)'], ...rows.map(t => [t.date, t.type === 'income' ? 'Receita' : 'Despesa', t.description, t.category, Number(t.amount).toFixed(2).replace('.', ',')])].map(row => row.map(escape).join(';')).join('\r\n');
}
