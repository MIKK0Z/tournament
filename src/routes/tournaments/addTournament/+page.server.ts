import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { db } from '$lib/server/db';

const addTournament: Action = async ({ request }) => {
	const data = await request.formData();
	const name = data.get('name');

	if (!name || typeof name !== 'string') {
		console.log('skill issue');
		return fail(400);
	}

	await db.tournament.create({
		data: {
			name,
		}
	})

	redirect(302, '/tournaments');
}

export const actions: Actions = { addTournament };

