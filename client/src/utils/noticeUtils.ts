export const expirationOptions = [
  "Days",
  "Weeks",
  "Months",
  "Years",
  "No Expiration",
];

export const calculateExpirationDate = (
  count: number,
  option: string
): string => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  switch (option) {
    case "Days":
      return new Date(now.setDate(now.getDate() + count)).toISOString();
    case "Weeks":
      return new Date(now.setDate(now.getDate() + count * 7)).toISOString();
    case "Months":
      return new Date(now.setMonth(now.getMonth() + count)).toISOString();
    case "Years":
      return new Date(now.setFullYear(now.getFullYear() + count)).toISOString();
    case "No Expiration":
      return new Date("2099-12-31").toISOString();
    default:
      return new Date("2099-12-31").toISOString();
  }
};
