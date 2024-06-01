<script lang="ts">
    import { browser } from "$app/environment";
    import type { PageData } from "./$types";

    export let data: PageData;

    $: ({ tournament } = data);
    $: ({ players } = tournament );
    $: size = getSmallestHigherPowerOfTwo(players.length);

    import { BracketsManager } from "brackets-manager";
    import { InMemoryDatabase } from "brackets-memory-db";

    const storage = new InMemoryDatabase();
    const manager = new BracketsManager(storage);

    const createTournament = async () => {
        await manager.create.stage({
            name: tournament.name,
            tournamentId: tournament.id,
            type: 'single_elimination',
            seeding: players.map(({ name }) => name),
            settings: {
                size,
                groupCount: 1,
            }
        })

        const tournamentData = await manager.get.stageData(0);

        (window as typeof window & { bracketsViewer: any }).bracketsViewer.render({
            stages: tournamentData.stage,
            matches: tournamentData.match,
            matchGames: tournamentData.match_game,
            participants: tournamentData.participant,
        });
    }

    const getSmallestHigherPowerOfTwo = (num: number) => {
        let power = 1;
        while (power < num) {
            power *= 2;
        }

        return power;
    }

    $: if (browser && tournament) createTournament();
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css" />
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js"></script>
</svelte:head>


<div class="brackets-viewer"></div>


<!-- {JSON.stringify(tournament)} -->

<!-- 

szyom orczyk
--- szyon grela
kuba 
--- michal pacia
--- micahl karp
filip jaskulski
mateusz klimek
filip wy
--- mateusz strug
--- oskar
franek
karol
nikodem
--- bartek trojan
marek
wiktor
tomek

 -->