<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	$: ({ players } = data);
</script>

<div class="min-h-dvh flex flex-col gap-4 items-center p-24">
	<h2 class="text-xl font-semibold">Players</h2>
	<a
		href="/players/addPlayer"
		class="btn btn-primary"
	>
		Add player <span class="icon">person_add</span>
	</a>
	<table class="table table-zebra table-fixed">
		<thead>
			<tr>
				<th>uuid</th>
				<th>first name</th>
				<th>last name</th>
				<th>age</th>
				<th>city</th>
				<th>created at</th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each players as player}
				<tr>
					<td>{player.id}</td>
					<td>{player.name}</td>
					<td>{player.surname}</td>
					<td>{player.age}</td>
					<td>{player.city}</td>
					<td>{player.createdAt}</td>
					<td>
						<a
							href="/players/editPlayer?id={player.id}"
							class="btn btn-warning"
						>
							edit
							<span class="icon">edit</span>
						</a>
					</td>
					<td>
						<form
							method="POST"
							action="?/deleteUser"
						>
							<input
								type="hidden"
								name="id"
								value={player.id}
							/>
							<button
								class="btn btn-error"
							>
								delete
								<span class="icon">delete</span>
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
