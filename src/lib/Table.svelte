<script lang="ts">
  import { formatCurrency, formatDate, type DonationReceipt } from "./kifu";

  export let donationReceipt: DonationReceipt;
</script>

<table class="table-auto">
  <thead>
    <tr>
      <th class="text-left p-1.5 pr-12 pl-0">Datum</th>
      <th class="text-left p-1.5 pl-0">Betrag</th>
    </tr>
  </thead>
  <tbody>
    {#each donationReceipt.donations as donation}
      <tr class="tabular-nums">
        <td class="text-left p-1.5 pl-0">
          {formatDate(new Date(donation.date))}
        </td>
        <td class="text-left p-1.5 pl-0">
          {formatCurrency(donation.amount)}
        </td>
      </tr>
    {/each}
    <tr class="font-bold border-t border-current">
      <td class="text-left p-1.5 pl-0">Gesamt</td>
      <td class="text-left p-1.5 pl-0 tabular-nums">
        {formatCurrency(donationReceipt.totalAmount)}
      </td>
    </tr>
  </tbody>
</table>
