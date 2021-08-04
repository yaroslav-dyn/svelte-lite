	<script>

		import Personal from "./Components/Personal.svelte";

		let fullName = "";
		let customers = ['Leha', 'Venya', 'Julia'];

		$: validForm = checkFileds(fullName);

		let checkFileds = (fName) => fName && fName.length < 3;


		</script> 

		<main>

			<form name="client-form" on:submit|preventDefault >
				
			</form>

		</main>


		{#each customers as person, i (i)}
			<b>{i+1}</b><Personal firstName={person} />
		{/each}

		<style>
			main {
				text-align: center;
				padding: 1em;
				max-width: 240px;
				margin: 0 auto;
			}

			h1 {
				color: #ff3e00;
				text-transform: uppercase;
				font-size: 4em;
				font-weight: 100;
			}

			:global(input) {
				outline: none;	
				border: none;
				background-color: #dedede;
				border-radius: 6px;
			}		

			input:global(.invalid) {
				border: 1px solid red;
			}

			input:global(.valid) {
				border: 1px solid green;
			}


			@media (min-width: 640px) {
				main {
					max-width: none;
				}
			}
		</style>