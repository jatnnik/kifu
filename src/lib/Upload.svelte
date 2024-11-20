<script lang="ts">
  import { FileDrop } from "svelte-droplet";

  export let handleFiles: (files: File[]) => void;
</script>

<FileDrop {handleFiles} let:droppable acceptedMimes={["application/json"]}>
  <div
    class="border border-dashed border-slate-400 rounded-md h-48 grid place-items-center data-[active=true]:border-slate-600"
    data-active={droppable}
  >
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M12 12v6" /><path d="m15 15-3-3-3 3" />
      </svg>
      <span class="block mt-6">JSON Dateien hier ablegen oder auswählen.</span>
    </div>
  </div>
</FileDrop>
