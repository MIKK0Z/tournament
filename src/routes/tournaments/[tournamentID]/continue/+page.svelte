<script lang="ts">
    import { browser } from "$app/environment";
    import type { PageData } from "./$types";

    export let data: PageData;

    $: ({ tournament } = data);
    $: ({ data: stringifiedTournamentData } = tournament);
    $: tournamentData = JSON.parse(stringifiedTournamentData);

    // import { BracketsManager } from "brackets-manager";
    // import { InMemoryDatabase } from "brackets-memory-db";

    // const storage = new InMemoryDatabase();
    // const manager = new BracketsManager(storage);

    const renderTournament = () => {
        (window as typeof window & { bracketsViewer: any }).bracketsViewer.render({
            stages: tournamentData.stage,
            matches: tournamentData.match,
            matchGames: tournamentData.match_game,
            participants: tournamentData.participant,
        });
    }

    const windowLoad: Promise<void> = new Promise((resolve, reject) => {
        if (!browser) reject();
        const interval = setInterval(() => {
            if (tournament && window && (window as typeof window & { bracketsViewer: any }).bracketsViewer) {
                resolve();
                clearInterval(interval);
                setTimeout(() => {
                    renderTournament();
                }, 50)
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
