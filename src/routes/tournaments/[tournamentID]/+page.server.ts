import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const ssr = false;

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentUUID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: parseInt(tournamentUUID) },
        include: { players: true },
    });

    return { tournament };
}