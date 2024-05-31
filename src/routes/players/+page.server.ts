import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const players = await db.player.findMany();
	return { players };
}

const deleteUser: Action = async ({ request }) => {
	const data = await request.formData();
	const id = data.get('id');

	if (!id || typeof id !== 'string') {
		console.log('skill issue');
		return fail(400);
	}

	await db.player.delete({
		where: { id },
	})

	redirect(302, '/players');
}

export const actions: Actions = { deleteUser };

