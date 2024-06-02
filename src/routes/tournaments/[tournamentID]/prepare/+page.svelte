<script lang="ts">
    import { el } from "@faker-js/faker";
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
	<div class="divider divider-vertical"></div>

	<h2 class="text-xl font-semibold">select pairing mode</h2>
	<select name="pairingMode" class="select select-bordered w-full max-w-xs" form="tournamentPrepareForm">
		<option value="name">name</option>
		<option value="age">age</option>
		<option value="ranking">ranking</option>
	</select>
	<div class="divider divider-vertical"></div>

	{#if tournament.players.length > 1}
		<form
			action="?/start"
			method="POST"
			id="tournamentPrepareForm"
		>
			<button type="submit" class="btn btn-primary">start<span class="icon">flag</span></button>
		</form>
	{:else}
		<span class="btn btn-disabled">start<span class="icon">flag</span></span>
	{/if}

	
</div>
