import type { PageServerLoad, Action, Actions } from "./$types";
import { db } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: parseInt(tournamentID) },
        include: { players: true },
    });

    const players = await db.player.findMany();

    return { tournament, players, tournamentID };
}

const addPlayer: Action = async ({ request }) => {
    const data = await request.formData();
    const playerID = data.get('playerID');
    const tournamentID = data.get('tournamentID');

    if (!playerID || !tournamentID || typeof playerID !== 'string' || typeof tournamentID !== 'string') {
        console.log('xd');
        return fail(400);
    }

    await db.tournament.update({
        where: { id: parseInt(tournamentID) },
        data: {
            players: {
                connect: { id: parseInt(playerID) },
            },
        },
    })

}

const deletePlayer: Action = async ({ request }) => {
    const data = await request.formData();
    const playerID = data.get('playerID');
    const tournamentID = data.get('tournamentID');

    if (!playerID || !tournamentID || typeof playerID !== 'string' || typeof tournamentID !== 'string') {
        console.log('rizz');
        return fail(400);
    }

    await db.tournament.update({
        where: { id: parseInt(tournamentID) },
        data: {
            players: {
                disconnect: { id: parseInt(playerID) },
            },
        },
    })
}

const start: Action = async ({ params }) => {
    const { tournamentID } = params;

    await db.tournament.update({
        where: { id: parseInt(tournamentID) },
        data: { status: 'inProgress' },
    })

    throw redirect(302, `/tournament/${tournamentID}/continue`)
}

export const actions: Actions = { addPlayer, deletePlayer, start };