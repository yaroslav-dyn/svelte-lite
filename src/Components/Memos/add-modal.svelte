<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();

  let memoForm = {
    name: null,
    description: null,
    status: false
  }
  let disabled:boolean;
  let statusMemo:boolean;

  $: disabled = !(!!memoForm.name);

  const createMemo = () => {
    memoForm.status = statusMemo;
    dispatch('addMemo', {
      memoForm
    });
  }

  const closeModal = () => {
    dispatch('closeModal', false)
  }


</script>

<div class="add_modal">
  <div class="add_modal__content">
    <div class="close_icon__wrapper">
      <span class="close_icon" on:click={closeModal}>x</span>
    </div>
    <form class="memo-controls-form" name="memo-controls-form" on:submit|preventDefault>
      <label for="name"> Enter memo name </label>
      <input id="name" type="text" name="name" bind:value={memoForm.name}>

      <label for="description"> Description </label>
      <textarea
          class="description_field"
          rows="4"
          id="description"
          name="description"
          style="resize: none"
          bind:value={memoForm.description}></textarea>

      <label for="status"> Status <input id="status" type="checkbox" bind:checked={statusMemo}></label>

      <button
        disabled="{disabled}"
        class="action-btn add-memo"
        on:click={createMemo}>
        Create note
      </button>

    </form>
  </div>
</div>

<style>
  .add_modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    padding: 1.2rem;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .add_modal__content {
    padding: 2rem;
    position: relative;
    background: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
    top: calc(50% - 200px);
    left: calc(50% - 200px);
    width: 400px;
  }

  .close_icon__wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .memo-controls-form > input {
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;
  }

  .memo-controls-form > label {
    margin-bottom: 8px;
  }

  .add-memo {
    width: 100%;
    margin: 1rem 0;
  }

  .close_icon {
    text-align: right;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }

  .description_field {
    resize: none;
    width: 100%;
    font-size: 14px;
  }

</style>
