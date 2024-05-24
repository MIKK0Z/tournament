<div class="min-h-dvh flex flex-col gap-4 items-center p-24">
	<h2 class="text-xl font-semibold">Add player</h2>

	<form class="w-96" method="POST">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">First name</span>
			</div>
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Second name</span>
			</div>
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Age</span>
			</div>
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">City</span>
			</div>
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full"
			/>
		</label>

		<div
			class="mt-4 grid justify-stretch grid-rows-1 grid-cols-2 gap-4"
		>
			<a href="/" class="btn btn-warning">cancel</a>
			<button type="submit" class="btn btn-primary"
				>add</button
			>
		</div>
	</form>
</div>
