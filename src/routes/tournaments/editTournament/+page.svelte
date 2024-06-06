<script lang="ts">
	import { page } from "$app/stores";
	const id = $page.url.searchParams.get("id") || "";
</script>

<div class="min-h-dvh flex flex-col gap-4 items-center p-24">
	<h2 class="text-xl font-semibold">Edit player</h2>

	<form class="w-96" method="POST" action="?/editTournament">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Name</span>
			</div>
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
				name="name"
			/>
		</label>

		<input type="hidden" name="id" value={id} />

		<div
			class="mt-4 grid justify-stretch grid-rows-1 grid-cols-2 gap-4"
		>
			<a href="/tournaments" class="btn btn-warning">cancel</a>
			<button type="submit" class="btn btn-primary"
				>Edit</button
			>
		</div>
	</form>
</div>
