import type { PageServerLoad, Action, Actions } from "./$types";
import { db } from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentUUID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: tournamentUUID },
        include: { players: true },
    });

    const players = await db.player.findMany();

    return { tournament, players };
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
        where: { id: tournamentID },
        data: {
            players: {
                connect: { id: playerID },
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
        where: { id: tournamentID },
        data: {
            players: {
                disconnect: { id: playerID },
            },
        },
    })
}

export const actions: Actions = { addPlayer, deletePlayer };