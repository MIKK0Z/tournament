<script lang="ts">
    let matchDialog: HTMLDialogElement;
    
    let firstPlayerName = '';
    let firstPlayerScore = 0;

    let secondPlayerName = '';
    let secondPlayerScore = 0;

    import { browser } from "$app/environment";
    import type { PageData } from "./$types";

    export let data: PageData;

    $: ({ tournament } = data);
    $: ({ data: stringifiedTournamentData } = tournament);
    $: tournamentData = JSON.parse(stringifiedTournamentData);

    import { BracketsManager } from "brackets-manager";
    import { InMemoryDatabase } from "brackets-memory-db";

    const storage = new InMemoryDatabase();
    const manager = new BracketsManager(storage);

    const renderTournament = async () => {
        await manager.import(tournamentData);

        const storedData = await manager.get.tournamentData(tournament.id);

        (window as typeof window & { bracketsViewer: any }).bracketsViewer.render({
            stages: storedData.stage,
            matches: storedData.match,
            matchGames: storedData.match_game,
            participants: storedData.participant,
        });

        (window as typeof window & { bracketsViewer: any }).bracketsViewer.onMatchClicked = async (match: any) => {
            console.log(match)
            // const matchID = m.id ?? 0;
            // const match = await manager.get.

            // const a = await manager.get.

            // firstPlayerName = match
            // matchDialog.showModal();
        }
    }

    const windowLoad: Promise<void> = new Promise((resolve, reject) => {
        if (!browser) reject();
        const interval = setInterval(() => {
            if (tournament && window && (window as typeof window & { bracketsViewer: any }).bracketsViewer) {
                resolve();
                clearInterval(interval);
                setTimeout(() => {
                    renderTournament();
                }, 10)
            }
        }, 50)
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

<dialog class="modal" bind:this={matchDialog}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">Hello!</h3>
        <p class="py-4">Press ESC key or click outside to close</p>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>