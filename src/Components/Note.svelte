<script lang="ts">
  import { createEventDispatcher } from 'svelte';

	export let name = '';
	export let description = '';
	export let orderNumber = 0;
  export let status = false;
  export let noteID = null;
  const dispatch = createEventDispatcher();

  $: statusHru =  status ? 'Complete': 'Pending'


  // Methosds
  const onDeleteItem = (id) => {
    dispatch('onNoteDelete', {id})
  }

</script>

<div class="personal-cart">
  <div>{orderNumber}. &nbsp;{name}</div>
  <div>{description}</div>
  <div class="status {status ? 'complete' : 'pending'}">{statusHru}</div>
  <div on:click|self={onDeleteItem(noteID)}>x</div>
</div>


<style>
	.personal-cart {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.6);
    padding: 1rem;
    margin-bottom: 8px;
  }
  .status.complete {
    color: green
  }
  .status.pending {
    color: orangered
  }
</style>
