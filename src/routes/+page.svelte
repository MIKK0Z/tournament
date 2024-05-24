<script lang="ts">
	import { supabase } from "$lib/supabase";

	type Player = {
		id: string;
		name: string;
		surname: string;
		age: number;
		city: string;
	};

	const getPlayers = async (): Promise<Array<Player>> => {
		let { data: players, error: _err } = await supabase
			.from("players")
			.select("*");

		console.log(players);
		return players as Array<Player>;
	};
</script>

<div class="min-h-dvh flex flex-col gap-4 items-center p-24">
	<h2 class="text-xl font-semibold">Players</h2>
	<a href="/addPlayer" class="btn btn-primary"
		>Add player <span class="icon">person_add</span></a
	>
	<table class="table table-zebra table-fixed">
		<thead>
			<tr>
				<th>id</th>
				<th>first name</th>
				<th>last name</th>
				<th>age</th>
				<th>city</th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#await getPlayers() then players}
				{#each players as player}
					<tr>
						<td>{player.id}</td>
						<td>{player.name}</td>
						<td>{player.surname}</td>
						<td>{player.age}</td>
						<td>{player.city}</td>
						<td>
							<a
								href="/"
								class="btn btn-warning"
							>
								edit
								<span
									class="icon"
									>edit</span
								>
							</a>
						</td>
						<td>
							<button
								class="btn btn-error"
							>
								delete

								<span
									class="icon"
									>delete</span
								>
							</button>
						</td>
					</tr>
				{/each}
			{/await}
		</tbody>
	</table>
</div>
