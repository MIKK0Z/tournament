import type { PageServerLoad, Action, Actions } from "./$types";
import { db } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";

export const ssr = false;

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: parseInt(tournamentID) },
        include: { players: true },
    })

    if (tournament.status === 'notStarted') {
        throw redirect(302, `/tournaments/${tournamentID}/prepare`);
    }

    if (tournament.status === 'finished') {
        throw redirect(302, `/tournaments/${tournamentID}/results`);
    }

    return { tournament };
}

const editTournamentData: Action = async ({ params, request }) => {
    const { tournamentID } = params;

    const formData = await request.formData();
    const data = formData.get('data');
    const currentRound = formData.get('currentRound');
    const isFinished = formData.get('isFinished');

    if (!data || !currentRound || !isFinished || typeof data !== 'string' || typeof currentRound !== 'string' || typeof isFinished !== 'string') {
        return fail(400);
    }

    console.log(isFinished)
    
    await db.tournament.update({
        where: { id: parseInt(tournamentID) },
        data: {
            data,
            currentRound: parseInt(currentRound),
        },
    })
}

export const actions: Actions = { editTournamentData };