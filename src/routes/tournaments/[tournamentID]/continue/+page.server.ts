import type { PageServerLoad } from "../$types";
import { db } from "$lib/server/db";

export const ssr = false;

export const load: PageServerLoad = async ({ params }) => {
    const { tournamentID } = params;
    const tournament = await db.tournament.findUniqueOrThrow({
        where: { id: parseInt(tournamentID) },
        include: { players: true },
    })

    return { tournament };
}