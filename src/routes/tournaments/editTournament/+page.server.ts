import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { db } from "$lib/server/db";

const editTournament: Action = async ({ request }) => {
	const data = await request.formData();
	const name = data.get('name');
	const id = data.get('id');

	if (
		!name || !id ||
		typeof name !== 'string' ||
		typeof id !== 'string'
	) {
		console.log('skill issue');
		return fail(400);
	}

	await db.tournament.update({
		where: { id: parseInt(id) },
		data: {
			name,
		},
	})

	redirect(302, '/tournaments');
}

export const actions: Actions = { editTournament };

