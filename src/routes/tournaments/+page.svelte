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
				<th>uuid</th>
				<th>name</th>
                <th>status</th>
				<th>count of players</th>
				<th>created at</th>
				<th>add players</th>
				<th></th>
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
                            <a href="/tournaments/{tournament.id}/selectPlayers" class="btn btn-primary">
                                Select players <span class="icon">person_add</span>
                            </a>
                        {:else}
                            <span class="btn btn-disabled">
                                Select players <span class="icon">person_add</span>
                            </span>
                        {/if}
                    </td>
					<td>
						<a href="/tournaments/{tournament.id}" class="btn btn-primary w-2/3">
							{#if tournament.status === 'notStarted'}
								start
							{:else if tournament.status === 'inProgress'}
								continue
							{:else}
								see resuts
							{/if}
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
