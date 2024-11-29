<script lang="ts">
	import { Content } from 'carbon-components-svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Content>
	{@render children()}
</Content>
