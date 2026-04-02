import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateTax(subtotal: number, rate = 0.05): number {
  return Math.round(subtotal * rate);
}

export function calculateDeliveryCharge(subtotal: number): number {
  if (subtotal >= 500) return 0;
  if (subtotal >= 300) return 20;
  return 40;
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PLACED: 'Order Placed',
    ACCEPTED: 'Order Accepted',
    PREPARING: 'Preparing Your Order',
    PICKED: 'Order Picked Up',
    ON_THE_WAY: 'On The Way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || status;
}

export function getOrderStatusStep(status: string): number {
  const steps: Record<string, number> = {
    PLACED: 0,
    ACCEPTED: 1,
    PREPARING: 2,
    PICKED: 3,
    ON_THE_WAY: 4,
    DELIVERED: 5,
  };
  return steps[status] ?? 0;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
