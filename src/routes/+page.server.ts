import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { supabase } from '$lib/supabase';

const deleteUser: Action = async ({ request }) => {
	const data = await request.formData();
	const id = data.get('id');

	if (!id || typeof id !== 'string') {
		console.log('skill issue');
		return fail(400);
	}

	await supabase
		.from('players')
		.delete()
		.eq('id', id);

	redirect(302, '/');
}

export const actions: Actions = { deleteUser };

