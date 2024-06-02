import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { faker } from '@faker-js/faker';

export const load: PageServerLoad = async () => {
	const players = await db.player.findMany({
		include: { tournaments: true },
	});
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
		where: { id: parseInt(id) },
	})

	redirect(302, '/players');
}

const generateFakePlayers: Action = async () => {
	const players = []

	for (let i = 0; i < 5; i++) {
		players.push({
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			age: faker.number.int({ min: 0, max: 100 }),
			city: faker.location.city(),
		})
	}

	await db.player.createMany({
		data: players,
	})
}

export const actions: Actions = { deleteUser, generateFakePlayers };

