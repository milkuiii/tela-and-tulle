import { InventoryItem, Rental } from '@/types/database';
import { differenceInCalendarDays, parseISO, addDays, subDays, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

export interface PriceBreakdown {
  totalDays: number;
  baseDays: number;
  extraDays: number;
  baseRentalPrice: number;
  extensionFee: number;
  rentalSubtotal: number;
  securityDeposit: number;
  totalAmountDue: number;
}

export function calculateRentalPrice(
  dress: InventoryItem,
  startDateStr: string,
  endDateStr: string
): PriceBreakdown {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  
  // Inclusive calendar days count
  const totalDays = Math.max(1, differenceInCalendarDays(end, start) + 1);
  const baseDays = 2;
  const extraDays = Math.max(0, totalDays - baseDays);
  
  const baseRentalPrice = Number(dress.base_rental_price);
  const extensionRate = Number(dress.extension_rate_daily);
  const extensionFee = extraDays * extensionRate;
  const rentalSubtotal = baseRentalPrice + extensionFee;
  const securityDeposit = Number(dress.security_deposit);
  const totalAmountDue = rentalSubtotal + securityDeposit;

  return {
    totalDays,
    baseDays,
    extraDays,
    baseRentalPrice,
    extensionFee,
    rentalSubtotal,
    securityDeposit,
    totalAmountDue,
  };
}

export function checkDressAvailability(
  dressId: string,
  startDateStr: string,
  endDateStr: string,
  allRentals: Rental[],
  bufferDays: number = 0
): { isAvailable: boolean; conflictingRental?: Rental; reason?: string } {
  const reqStart = parseISO(startDateStr);
  const reqEnd = parseISO(endDateStr);

  if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime()) || reqEnd < reqStart) {
    return { isAvailable: false, reason: 'Invalid date range' };
  }

  // Filter rentals for this dress that are active/confirmed ('booked', 'out', 'late')
  const activeRentals = allRentals.filter(
    (r) => r.dress_id === dressId && ['booked', 'out', 'late'].includes(r.status)
  );

  for (const rental of activeRentals) {
    const rentStart = parseISO(rental.start_date);
    const rentEnd = parseISO(rental.end_date);

    // Turnaround/cleaning buffer before and after rental window
    const bufferedStart = subDays(rentStart, bufferDays);
    const bufferedEnd = addDays(rentEnd, bufferDays);

    const isOverlapping = areIntervalsOverlapping(
      { start: reqStart, end: reqEnd },
      { start: bufferedStart, end: bufferedEnd },
      { inclusive: true }
    );

    if (isOverlapping) {
      return {
        isAvailable: false,
        conflictingRental: rental,
        reason: bufferDays > 0 
          ? `Dress is reserved during this window (includes ${bufferDays}-day cleaning buffer around active booking).`
          : `Dress is reserved during this window.`,
      };
    }
  }

  return { isAvailable: true };
}

export function calculateConsignorEarnings(rental: Rental, dress: InventoryItem): number {
  // Only valid if rental is completed ('returned') or ongoing ('out'), and fully paid
  if (!['returned', 'out'].includes(rental.status)) {
    return 0;
  }

  // Must match amount_paid >= amount_due
  if (Number(rental.amount_paid) < Number(rental.amount_due)) {
    return 0;
  }

  const breakdown = calculateRentalPrice(dress, rental.start_date, rental.end_date);
  const commissionRate = rental.snapshot_commission_rate ?? 0.50;

  // Earnings: (base_rental_price + extension_fees) * snapshot_commission_rate
  return breakdown.rentalSubtotal * commissionRate;
}

export function calculateDepositReturned(depositPaid: number, amountRetained: number): number {
  return Math.max(0, Number(depositPaid) - Number(amountRetained));
}
