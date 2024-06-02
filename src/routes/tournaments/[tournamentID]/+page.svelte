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
            seeding: players.map(({ name, surname }) => `${name} ${surname}`),
            settings: {
                size,
                groupCount: 1,
                seedOrdering: ['reverse']
            }
        })

        const tournamentData = await manager.get.stageData(0);

        (window as typeof window & { bracketsViewer: any }).bracketsViewer.render({
            stages: tournamentData.stage,
            matches: tournamentData.match,
            matchGames: tournamentData.match_game,
            participants: tournamentData.participant,
        });

        console.log(JSON.stringify(tournamentData))
    }

    const getSmallestHigherPowerOfTwo = (num: number) => {
        let power = 1;
        while (power < num) {
            power *= 2;
        }

        return power;
    }

    const windowLoad: Promise<void> = new Promise((resolve, reject) => {
        if (!browser) reject();
        const interval = setInterval(() => {
            if (tournament && window && (window as typeof window & { bracketsViewer: any }).bracketsViewer) {
                resolve();
                clearInterval(interval);
                createTournament();
            }
        }, 500)
    })
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css" />
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js"></script>
</svelte:head>

<div class="grid min-h-dvh">
    {#await windowLoad}
        <div class="place-self-center flex flex-col items-center gap-4">
            <span class="loading loading-spinner loading-lg"></span>
            <h3>Loading</h3>
        </div>
    {:then _window}
        <div class="brackets-viewer grid place-content-center"></div>
    {:catch _error}
    <div class="place-self-center flex flex-col items-center gap-4">
        <span class="icon text-7xl">warning</span>
        <h3>something went wrong</h3>
        <button type="button" class="btn btn-primary" on:click={() => {location.reload()}}>try again</button>
    </div>
    {/await}
</div>