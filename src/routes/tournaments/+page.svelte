<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	$: ({ tournaments } = data);
</script>

<div class="min-h-dvh flex flex-col gap-4 items-center p-24">
	<h2 class="text-xl font-semibold">Tournaments</h2>
	<a
		href="/tournaments/addTournament"
		class="btn btn-primary"
	>
		Add tournament <span class="icon">add_circle</span>
	</a>
	<table class="table table-zebra table-fixed">
		<thead>
			<tr>
				<th>id</th>
				<th>name</th>
                <th>status</th>
				<th>count of players</th>
				<th>created at</th>
				<th>go to tournament</th>
				<th>edit</th>
				<th>delete</th>
			</tr>
		</thead>
		<tbody>
			{#each tournaments as tournament}
				<tr>
					<td>{tournament.id}</td>
					<td>{tournament.name}</td>
                    <td>{tournament.status.split(/(?=[A-Z])/).map(word => word.toLowerCase()).join(' ')}</td>
					<td>{tournament.players.length}</td>
					<td>{tournament.createdAt}</td>
					<td>
						{#if tournament.status === 'notStarted'}
							<a href="/tournaments/{tournament.id}/prepare" class="btn btn-primary w-2/3">
								prepare
							</a>
						{:else if tournament.status === 'inProgress'}
							<a href="/tournaments/{tournament.id}/continue" class="btn btn-primary w-2/3">
								continue
							</a>
						{:else}
							<a href="/tournaments/{tournament.id}/results" class="btn btn-primary w-2/3">
								see results
							</a>
						{/if}
					</td>
					<td>
						<a
							href="/tournaments/editTournament?id={tournament.id}"
							class="btn btn-warning"
						>
							edit
							<span class="icon">edit</span>
						</a>
					</td>
					<td>
						<form
								method="POST"
								action="?/deleteTournament"
							>
								<input
									type="hidden"
									name="id"
									value={tournament.id}
								/>
								<button
									class="btn btn-error"
									type="submit"
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
