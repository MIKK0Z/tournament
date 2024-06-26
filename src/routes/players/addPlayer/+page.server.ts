import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { db } from '$lib/server/db';

const addUser: Action = async ({ request }) => {
	const data = await request.formData();
	const name = data.get('name');
	const surname = data.get('surname');
	const age = data.get('age');
	const city = data.get('city');

	if (
		!name || !surname || !age || !city ||
		typeof name !== 'string' ||
		typeof surname !== 'string' ||
		typeof age !== 'string' ||
		typeof city !== 'string'
	) {
		console.log('skill issue');
		return fail(400);
	}

	await db.player.create({
		data: {
			name,
			surname,
			age: parseInt(age),
			city,
		}
	})

	redirect(302, '/players');
}

export const actions: Actions = { addUser };

