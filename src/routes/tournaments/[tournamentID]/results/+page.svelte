<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	$: ({ tournament } = data);
</script>

<div class="min-h-dvh grid place-content-center">
	<h3 class="text-center text-3xl">The winner is:</h3>
	<h2 class="text-6xl mt-4">{tournament.winner}</h2>
</div>
