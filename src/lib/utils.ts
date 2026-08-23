import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function formatEventDate(dateString: string): string {
  try {
    const [day, month, year] = dateString.split(".");
    if (day && month && year) {
      return `${day} Thg ${month}, ${year}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}
