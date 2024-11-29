<script lang="ts">
	import {
		Accordion,
		Button,
		Column,
		FileUploaderDropContainer,
		Grid,
		Row
	} from 'carbon-components-svelte';

	import { createDonationService } from '$lib/services/donationService.svelte';
	import Receipt from '$lib/components/Receipt.svelte';

	const donationService = createDonationService();

	function validateFiles(files: ReadonlyArray<File>) {
		return files.filter((file) => file.type === 'application/json');
	}

	function onUpload(event: CustomEvent<readonly File[]>) {
		donationService.collectDonationsFromTransactions(event.detail);
	}

	function handleComplete(donor: string) {
		donationService.toggleCompleted(donor);
	}

	function handleClear() {
		if (window.confirm('Möchstest du die Daten wirklich löschen?')) {
			donationService.clear();
		}
	}
</script>

<Grid padding>
	<Row>
		<Column>
			<h1>kifu</h1>
		</Column>
	</Row>
	<Row>
		<Column>
			<FileUploaderDropContainer
				multiple
				labelText="Dateien auswählen oder hier ablegen."
				{validateFiles}
				on:change={onUpload}
			/>
		</Column>
	</Row>
	{#if donationService.donationsByDonor.length}
		<Row>
			<Column>
				<h2>Spenden {donationService.year}</h2>
			</Column>
			<Column>
				<Button kind="danger-ghost" onclick={handleClear}>Löschen</Button>
			</Column>
		</Row>
		<Row>
			<Column>
				<Accordion align="start">
					{#each donationService.donationsByDonor as receipt}
						<Receipt
							{receipt}
							onComplete={handleComplete}
							completed={donationService.isCompleted(receipt.donorName)}
						/>
					{/each}
				</Accordion>
			</Column>
		</Row>
	{/if}
</Grid>
