<script lang="ts">
    import type { PageData } from "./$types";
    
    export let data: PageData;

    $: ({ tournament, players } = data);
</script>

<div class="min-h-dvh flex flex-col gap-4 items-center p-24">
	<h2 class="text-xl font-semibold">select players</h2>
	<table class="table table-zebra table-fixed">
		<thead>
			<tr>
				<th>id</th>
				<th>first name</th>
				<th>last name</th>
				<th>wybierz</th>
			</tr>
		</thead>
		<tbody>
			{#each players as player}
				<tr>
					<td>{player.id}</td>
					<td>{player.name}</td>
					<td>{player.surname}</td>
					<td>
						{#if tournament.players.some(({ id }) => player.id === id)}
                            <form action="?/deletePlayer" method="POST">
                                <input type="hidden" name="playerID" value={player.id} />
                                <input type="hidden" name="tournamentID" value={tournament.id} />
                                <button type="submit" class="btn btn-warning w-1/3">remove<span class="icon">person_remove</span></button>
                            </form>
                        {:else}
                            <form action="?/addPlayer" method="POST">
                                <input type="hidden" name="playerID" value={player.id} />
                                <input type="hidden" name="tournamentID" value={tournament.id} />
                                <button type="submit" class="btn btn-primary w-1/3">add<span class="icon">person_add</span></button>
                            </form>
                        {/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<form action="?/start" method="POST">
		<button type="submit" class="btn btn-primary">start<span class="icon">flag</span></button>
	</form>
</div>
