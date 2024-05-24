import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { supabase } from '$lib/supabase';

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

	await supabase
		.from('players')
		.update({ name, surname, age: ageI, city })
		.eq('id', id)

	redirect(302, '/');
}

export const actions: Actions = { editUser };
