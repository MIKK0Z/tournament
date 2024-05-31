import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentUUID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: tournamentUUID },
        include: { players: true },
    });

    return { tournament };
}