export const buildOrderData = (order_lines) => {
  let order = {
  purchase_country: "SE",
  purchase_currency: "SEK",
  locale: "sv-SE",
  auto_capture: true,
  order_lines,
  order_amount: order_lines.reduce((acc, line) => {
    return acc + line.total_amount;
  }, 0),
  order_tax_amount: order_lines.reduce((acc, line) => {
    return acc + line.total_tax_amount;
  }, 0),
  options: {
    disable_confirmation_modals: true
  }
  }
  return order
}
