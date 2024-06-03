import type { PageServerLoad, Action, Actions } from "./$types";
import { db } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import { getSmallestHigherPowerOfTwo } from "$lib/utils/getSmallestHigherPowerOfTwo";
import type { Player } from "@prisma/client";

import { BracketsManager } from "brackets-manager";
import { InMemoryDatabase } from "brackets-memory-db";

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: parseInt(tournamentID) },
        include: { players: true },
    });

    if (tournament.status !== 'notStarted') {
        throw redirect(302, `/tournaments/${tournamentID}/continue`);
    }

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

const start: Action = async ({ params, request }) => {
    const data = await request.formData();
    const pairingMode = data.get('pairingMode');

    if (!pairingMode || typeof pairingMode !== 'string') {
        console.log('ohio');
        return fail(400);
    }

    const { tournamentID } = params;

    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: parseInt(tournamentID) },
        include: { players: true },
    })

    const size = getSmallestHigherPowerOfTwo(tournament.players.length);

    const storage = new InMemoryDatabase();
    const manager = new BracketsManager(storage);

    await manager.create.stage({
        name: tournament.name,
        tournamentId: tournament.id,
        type: 'single_elimination',
        seeding: getSortedPlayers(pairingMode, tournament.players).map(({ name, surname }) => `${name} ${surname}`),
        settings: {
            size,
            seedOrdering: ['natural'],
        },
    })

    const tournamentData = await manager.get.stageData(0);

    await db.tournament.update({
        where: { id: parseInt(tournamentID) },
        data: {
            status: 'inProgress',
            data: JSON.stringify(tournamentData),
        }
    })

    throw redirect(302, `/tournaments/${tournamentID}/continue`)
}

export const actions: Actions = { addPlayer, deletePlayer, start };

const getSortedPlayers = (sortBy: string, players: Array<Player>) => {
    if (sortBy === 'name') {
        return players.sort((a, b) => a.name[0].localeCompare(b.name[0]));
    }
    if (sortBy === 'age') {
        return players.sort((a, b) => a.age - b.age);
    }
    return players.sort((a, b) => a.ranking - b.ranking);
}