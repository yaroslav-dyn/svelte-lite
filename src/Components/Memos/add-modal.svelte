<script>

  import { createEventDispatcher } from 'svelte';

  let memoForm = {
    name: null,
    description: null,
    status: false
  }

  let statusMemo = false;

  const dispatch = createEventDispatcher();

  $: disabledButton = !memoForm.name;

  const createMemo = () => {
    memoForm.status = statusMemo;
    dispatch('addMemo', {
      memoForm
    });
  }

</script>

<div class="add_modal">
  <div>
    <form name="memo-controls-form" on:submit|preventDefault>
      <label>
        Enter memo name
        <input type="text" name="name" bind:value={memoForm.name} >
      </label>
      <label>
        Description
        <input type="text" name="description" bind:value={memoForm.description} >
      </label>
      <label>
        Status
        <input type="checkbox" bind:checked={statusMemo}>
      </label>
      <button :disabled="{disabledButton}" class="action-btn" on:click={createMemo}>Create</button>
    </form>
  </div>
</div>

<style>
  .add_modal {
    position: fixed;
    z-index: 100;
    padding: 1.2rem;
    border-radius: 6px;
    max-width: 50vw;
    max-height: 50vh;
    background: #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.6);
    width: 400px;
    height: 400px;
    top: calc( 50% - 200px);
    left: calc(50% - 200px);
  }
</style>
