<script lang="ts">
  import {
    getDonationYear,
    groupDonationsByDonor,
    isDonation,
    transactionFileSchema,
    type Donation,
  } from "./lib/kifu";
  import Table from "./lib/Table.svelte";
  import Upload from "./lib/Upload.svelte";

  let allDonations = $state<Donation[]>([]);
  let donationsByDonor = $derived(groupDonationsByDonor(allDonations));
  let year = $derived(getDonationYear(allDonations));

  $effect(() => {
    if (donationsByDonor.length) {
      localStorage.setItem(
        `donationsByDonor`,
        JSON.stringify(donationsByDonor),
      );
    }
  });

  function handleFiles(files: File[]) {
    for (const file of files) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (typeof event.target?.result !== "string") {
          return;
        }

        const data = transactionFileSchema.parse(
          JSON.parse(event.target.result),
        );
        const donations = data.period.transactions.filter((transaction) =>
          isDonation(transaction),
        );

        allDonations.push(...donations);
      };

      reader.readAsText(file);
    }
  }

  function flushLocalStorage() {
    if (window.confirm("Möchtest du die Zusammenfassung wirklich löschen?")) {
      localStorage.removeItem("donationsByDonor");
      allDonations = [];
    }
  }

  function handleComplete(donor: string) {
    // ...
  }
</script>

<header>
  <h1 class="font-bold">kifu</h1>
</header>
<main class="mt-6 space-y-10">
  <Upload {handleFiles} />

  {#if donationsByDonor.length}
    <div>
      <div class="flex justify-between items-center">
        <h2 class="font-bold text-lg">Spenden {year}</h2>
        <button onclick={flushLocalStorage} class="text-rose-700">
          Löschen
        </button>
      </div>

      <div class="space-y-4 mt-8">
        {#each donationsByDonor as donation}
          <details class="border border-slate-600 p-4 rounded-md">
            <summary class="font-bold cursor-default">
              {donation.name}
              {#if donation.completed}
                <span class="pl-2">✅</span>
              {/if}
            </summary>
            <div class="mt-2 space-y-4 pl-3">
              <Table donationReceipt={donation} />
              <button
                class="font-bold text-green-600"
                onclick={() => handleComplete(donation.name)}
              >
                Erledigt
              </button>
            </div>
          </details>
        {/each}
      </div>
    </div>
  {/if}
</main>
