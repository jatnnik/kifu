<script lang="ts">
	import {
		AccordionItem,
		Button,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte';
	import { formatCurrency, formatDate } from '$lib/utils';
	import type { DonationReceipt } from '$lib/services/donationService.svelte';
	import { Checkmark, CheckmarkOutline, Undo } from 'carbon-icons-svelte';

	export let receipt: DonationReceipt;
	export let onComplete: (donor: string) => void;
	export let completed: boolean;
</script>

<AccordionItem>
	<svelte:fragment slot="title">
		<div style="display: flex; align-items: center; gap: 16px;">
			<p>{receipt.donorName}</p>
			{#if completed}
				<CheckmarkOutline size={20} />
			{/if}
		</div>
	</svelte:fragment>
	<StructuredList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Datum</StructuredListCell>
				<StructuredListCell head>Betrag</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each receipt.donations as donation}
				<StructuredListRow>
					<StructuredListCell>
						{formatDate(new Date(donation.date))}
					</StructuredListCell>
					<StructuredListCell>
						{formatCurrency(donation.amount)}
					</StructuredListCell>
				</StructuredListRow>
			{/each}
			<StructuredListRow>
				<StructuredListCell>
					<strong>Gesamt</strong>
				</StructuredListCell>
				<StructuredListCell>
					<strong>{formatCurrency(receipt.totalAmount)}</strong>
				</StructuredListCell>
			</StructuredListRow>
		</StructuredListBody>
	</StructuredList>

	<Button
		kind={completed ? 'secondary' : 'primary'}
		icon={completed ? Undo : Checkmark}
		onclick={() => onComplete(receipt.donorName)}
	>
		{completed ? 'Rückgängig' : 'Erledigt'}
	</Button>
</AccordionItem>
