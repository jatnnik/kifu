import { LocalStorage } from '$lib/storage.svelte';
import { z } from 'zod';

const DONATION_IDENTIFIER = 'Elektronische Spenden';

const transactionSchema = z.object({
	description: z.string().optional(),
	referenceNumber: z.string().optional(),
	date: z.string(),
	amount: z.number()
});
type Transaction = z.infer<typeof transactionSchema>;

const transactionFileSchema = z.object({
	period: z.object({
		transactions: z.array(transactionSchema)
	})
});

type Donation = {
	description: typeof DONATION_IDENTIFIER;
	referenceNumber: string;
	date: string;
	amount: number;
};

export type DonationReceipt = {
	id: string;
	donorName: string;
	donations: {
		date: string;
		amount: number;
	}[];
	totalAmount: number;
	completed: boolean;
};

export function createDonationService() {
	const completed = new LocalStorage<string[]>('completed', []);
	const donations = new LocalStorage<Donation[]>('donations', []);

	const donationsByDonor = $derived.by(() => {
		const map = new Map<string, DonationReceipt>([]);

		for (const donation of donations.current) {
			const { referenceNumber, date, amount } = donation;

			const donorName = referenceNumber.replace('und', '&');

			if (!map.get(donorName)) {
				map.set(donorName, {
					id: crypto.randomUUID(),
					donorName,
					donations: [],
					totalAmount: 0,
					completed: false
				});
			}

			map.get(donorName)!.donations.push({
				date,
				amount
			});

			map.get(donorName)!.totalAmount += amount;
			map.get(donorName)!.completed = completed.current.includes(donorName);
		}

		return Array.from(map)
			.map(([, value]) => value)
			.sort((a, b) => a.donorName.localeCompare(b.donorName));
	});

	const year = $derived(
		donations.current[0]
			? new Date(donations.current[0].date).getFullYear().toString()
			: (new Date().getFullYear() - 1).toString()
	);

	function collectDonationsFromTransactions(files: readonly File[]) {
		for (const file of files) {
			const reader = new FileReader();

			reader.onload = (event) => {
				if (typeof event.target?.result !== 'string') {
					return;
				}

				const data = transactionFileSchema.parse(JSON.parse(event.target.result));

				donations.current.push(
					...data.period.transactions.filter((transaction) => isDonation(transaction))
				);
			};

			reader.readAsText(file);
		}
	}

	function toggleCompleted(donor: string) {
		if (completed.current.includes(donor)) {
			completed.current = completed.current.filter((d) => d !== donor);
		} else {
			completed.current = [...completed.current, donor];
		}
	}

	return {
		get year() {
			return year;
		},

		get donationsByDonor() {
			return donationsByDonor;
		},

		isCompleted(donor: string) {
			return completed.current.includes(donor);
		},

		clear() {
			completed.current = [];
			donations.current = [];
		},

		collectDonationsFromTransactions,
		toggleCompleted
	};
}

function isDonation(transaction: Transaction): transaction is Donation {
	return (
		!!transaction.description &&
		transaction.description === DONATION_IDENTIFIER &&
		!!transaction.referenceNumber &&
		!transaction.referenceNumber.includes('Online')
	);
}
