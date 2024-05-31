import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { db } from "$lib/server/db";

const editUser: Action = async ({ request }) => {
	const data = await request.formData();
	const name = data.get('name');
	const surname = data.get('surname');
	const age = data.get('age');
	const city = data.get('city');
	const id = data.get('id');

	if (
		!name || !surname || !age || !city || !id ||
		typeof name !== 'string' ||
		typeof surname !== 'string' ||
		typeof age !== 'string' ||
		typeof city !== 'string' ||
		typeof id !== 'string'
	) {
		console.log('skill issue');
		return fail(400);
	}

	const ageI = parseInt(age);

	await db.player.update({
		where: { id },
		data: {
			name,
			surname,
			age: ageI,
			city,
		},
	})

	redirect(302, '/players');
}

export const actions: Actions = { editUser };

