<div class="add_modal">
  <div class="add_modal__content">
    <div class="close_icon__wrapper">
      <i class="close_icon close material-icons" on:click={closeModal}>close</i>
    </div>
    <form class="memo-controls-form" name="memo-controls-form" on:submit|preventDefault>

      <label for="group"> Enter group name </label>
      <input id="group" type="text" name="group" bind:value={ideaForm.group}>

      <label for="name"> Your idea title </label>
      <input id="name" type="text" name="name" bind:value={ideaForm.name}>

      <label for="description"> Text </label>
      <textarea
          class="description_field"
          rows="4"
          id="description"
          name="description"
          bind:value={ideaForm.text}></textarea>

      <button
          disabled="{disabled}"
          class="action-btn success add-memo"
          on:click={createIdea}>
        Create idea
      </button>
    </form>
  </div>
</div>

<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  let ideaForm = {
    name: null,
    text: null,
    group: ''
  }
  let currentGroup = '';
  $: disabled = !ideaForm.name || !ideaForm.group.length > 0;

  const createIdea = () => {
    ideaForm.group = currentGroup;
    dispatch('addIdea', {
      ideaForm
    });
  }

  const closeModal = () => {
    dispatch('closeModal', false)
  }

</script>

<style lang="scss">
  @import '../../../scss/vars.scss';

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

    &__content {
      padding: 2rem;
      position: relative;
      background: #fff;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
      top: 0;
      left: calc(50% - 200px);
      width: 400px;
      @media screen and (max-width: $medium-device) {
        width: 100%;
        top: 0;
        left: 0;
      }
    }
  }


  .close_icon__wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .memo-controls-form {
    > input {
      width: 100%;
      padding: 8px 16px;
      border-radius: 4px;
    }

    > label {
      font-size: 18px;
      margin-bottom: 8px;
    }

  }

  .add-memo {
    width: 100%;
    margin: 1.4rem 0;
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
