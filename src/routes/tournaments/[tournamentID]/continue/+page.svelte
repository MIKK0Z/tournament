<script lang="ts">
    import { enhance } from "$app/forms";
    import type { Match } from "$lib/types/Match";

    let matchDialog: HTMLDialogElement;

    let matchID = 0;
    let currentRoundDiff = 0;
    
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

    let bracketsViewerDiv: HTMLDivElement | null = null;

    const renderTournament = async () => {
        await manager.import(tournamentData);

        await rerenderTournament();
        await addOnClickMatch();
    }

    const rerenderTournament = async () => {
        const storedData = await manager.get.tournamentData(tournament.id);
        const { match: matches } = storedData;

        if(matches.filter(({ round_id }) => round_id === tournament.currentRound).every(({ opponent1, opponent2 }) => (!opponent1 && !opponent2) || (opponent1?.result))) {
            currentRoundDiff = 1;
        }

        (window as typeof window & { bracketsViewer: any }).bracketsViewer.render({
            stages: storedData.stage,
            matches: storedData.match,
            matchGames: storedData.match_game,
            participants: storedData.participant,
        });
    }

    const addOnClickMatch = async () => {
        (window as typeof window & { bracketsViewer: any }).bracketsViewer.onMatchClicked = async (match: Match) => {
            if (!match.opponent1 || !match.opponent2 || (!match.opponent1.id && match.opponent1.id !== 0) || (!match.opponent2.id && match.opponent2.id !== 0)) {
                return;
            }

            if (match.opponent1.result || match.opponent2.result) {
                return;
            }

            const savedData = await manager.get.tournamentData(tournament.id);
            const { participant: participants } = savedData;

            if (match.round_id !== (tournament.currentRound + currentRoundDiff)) {
                // return; // do wywalenia to jest
            }

            matchID = match.id;

            firstPlayerName = participants.find(({ id }) => id === match.opponent1.id)?.name ?? '';
            secondPlayerName = participants.find(({ id }) => id === match.opponent2.id)?.name ?? '';

            matchDialog.showModal();
        }
    }

    const isFinished = async () => {
        try {
            await manager.get.finalStandings(0);
            return true;
        } catch (error) {
            return false;
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
        <div class="brackets-viewer grid place-content-center" bind:this={bracketsViewerDiv}></div>
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
        <h3 class="font-bold text-lg">enter match result</h3>
        <div class="flex my-4">
            <div class="flex-1 space-y-2 flex flex-col justify-between">
                <h3 class="text-center">{firstPlayerName}</h3>
                <input type="number" placeholder="score" class="input input-bordered w-full" bind:value={firstPlayerScore} />
            </div>
            <div class="divider divider-horizontal">VS</div>
            <div class="flex-1 space-y-2 flex flex-col justify-between">
                <h3 class="text-center">{secondPlayerName}</h3>
                <input type="number" placeholder="score" class="input input-bordered w-full" bind:value={secondPlayerScore} />
            </div>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <button type="submit" class="btn">cancel</button>
            </form>
            <form
                action="?/editTournamentData"
                method="POST"
                use:enhance={async ({ formData }) => {
                    await manager.update.match({
                        id: matchID,
                        opponent1: { score: firstPlayerScore, result: firstPlayerScore >= secondPlayerScore ? 'win' : 'loss' },
                        opponent2: { score: secondPlayerScore, result: firstPlayerScore < secondPlayerScore ? 'win' : 'loss' },
                    })

                    const newData = await manager.get.stageData(0);
                    formData.set('data', JSON.stringify(newData));

                    formData.set('currentRound', `${tournament.currentRound + currentRoundDiff}`);

                    const isFinishedVal = await isFinished();
                    formData.set('isFinished', `${isFinishedVal}`);

                    matchDialog.close();

                    matchID = 0;
                    firstPlayerName = '';
                    firstPlayerScore = 0;
                    secondPlayerName = '';
                    secondPlayerScore = 0;

                    bracketsViewerDiv?.replaceChildren();
                    await rerenderTournament();
                }}
            >
                <button type="submit" class="btn btn-primary" disabled={firstPlayerScore === secondPlayerScore}>save</button>
            </form>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>