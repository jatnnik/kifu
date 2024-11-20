import { z } from "zod";

const DONATION_IDENTIFIER = "Elektronische Spenden";

const transactionSchema = z.object({
  description: z.string().optional(),
  referenceNumber: z.string().optional(),
  date: z.string(),
  amount: z.number(),
});
type Transaction = z.infer<typeof transactionSchema>;

const donationSchema = z.object({
  description: z.literal(DONATION_IDENTIFIER),
  referenceNumber: z.string(),
  date: z.string(),
  amount: z.number(),
});
export type Donation = z.infer<typeof donationSchema>;

export const transactionFileSchema = z.object({
  period: z.object({
    transactions: z.array(transactionSchema),
  }),
});

export type DonationReceipt = {
  name: string;
  donations: {
    date: string;
    amount: number;
  }[];
  totalAmount: number;
  completed: boolean;
};

export function groupDonationsByDonor(donations: Donation[]) {
  const persisted = localStorage.getItem("donationsByDonor")
    ? (JSON.parse(
        localStorage.getItem("donationsByDonor") as string,
      ) as DonationReceipt[])
    : undefined;

  const map = new Map<string, DonationReceipt>(
    persisted ? persisted.map((item) => [item.name, item]) : [],
  );

  if (persisted) {
    return makeArrayFromMap(map);
  }

  for (const donation of donations) {
    const { referenceNumber, date, amount } = donation;

    const donorName = referenceNumber.replace("und", "&");

    if (!map.get(donorName)) {
      map.set(donorName, {
        name: donorName,
        donations: [],
        totalAmount: 0,
        completed: false,
      });
    }

    map.get(donorName)!.donations.push({
      date,
      amount,
    });

    map.get(donorName)!.totalAmount += amount;
  }

  return makeArrayFromMap(map);
}

export function getDonationYear(donations: Donation[]) {
  if (!donations[0]) {
    return (new Date().getFullYear() - 1).toString();
  }

  return new Date(donations[0].date).getFullYear().toString();
}

export function isDonation(transaction: Transaction): transaction is Donation {
  return (
    !!transaction.description &&
    transaction.description === DONATION_IDENTIFIER &&
    !!transaction.referenceNumber &&
    !transaction.referenceNumber.includes("Online")
  );
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function makeArrayFromMap(map: Map<string, DonationReceipt>) {
  return Array.from(map)
    .map(([, value]) => value)
    .sort((a, b) => a.name.localeCompare(b.name));
}
