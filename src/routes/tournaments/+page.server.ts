import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const tournaments = await db.tournament.findMany({
		include: { players: true }
	});
	return { tournaments };
}

const deleteTournament: Action = async ({ request }) => {
	const data = await request.formData();
	const id = data.get('id');

	if (!id || typeof id !== 'string') {
		console.log('skill issue');
		return fail(400);
	}

	await db.tournament.delete({
		where: { id: parseInt(id) },
	})
}

export const actions: Actions = { deleteTournament };

