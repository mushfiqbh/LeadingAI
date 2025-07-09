import { User } from "firebase/auth";

export const expirationOptions = [
  { value: "", label: "Select expiration period" },
  { value: "NO_EXPIRATION", label: "No expiration" },
  { value: "1_MONTH", label: "1 month" },
  { value: "4_MONTHS", label: "4 months" },
  { value: "6_MONTHS", label: "6 months" },
  { value: "1_YEAR", label: "1 year" },
];

export const calculateExpirationDate = (option: string): string => {
  if (option === "NO_EXPIRATION") return "NO_EXPIRATION";

  const now = new Date();
  switch (option) {
    case "1_MONTH":
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    case "4_MONTHS":
      return new Date(now.setMonth(now.getMonth() + 4)).toISOString();
    case "6_MONTHS":
      return new Date(now.setMonth(now.getMonth() + 6)).toISOString();
    case "1_YEAR":
      return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
    default:
      return "";
  }
};

export const isFormValid = ({
  user,
  noticeImage,
  expirationOption,
}: {
  user: User | null;
  noticeImage: File | null;
  expirationOption: string;
}) => {
  return user && noticeImage && expirationOption !== "";
};
