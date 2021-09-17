<div class="base_modal confirm_modal">

  <div class="base_modal__content">

    <h3 class={`base_modal__title ${confirmType}`}>
      {title}
    </h3>

    <p class="base_modal__message centered-text">
      {message}
    </p>

    {#if hasControls}
      <div class="base_modal__controls">
        <button class="action-btn default" on:click={closeAction}>No</button>
        <button class="action-btn dark" on:click={confirmAction}>Yes</button>
      </div>
    {/if}

  </div>

</div>

<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let title = '';
    export let message = '';
    export let hasControls = false;
    export let confirmType = 'normal'

    const dispatch = createEventDispatcher();

    const confirmAction = () => {
        dispatch('confirmAction');
    };

    const closeAction = () => {
        dispatch('closeModal');
    }


</script>

<style lang="scss">
  @import '../../scss/vars';

  .base_modal {
    &__title {
      font-size: 1.8rem;
      margin: 0;
      padding: 1.2rem;
      text-align: center;

      &.normal {
        color: #000;
      }

      &.warning {
        color: $warningText;
      }

      &.error {
        color: $errorText;
      }
    }

    &__message {
      margin: 0;
      padding: 1.1rem;
    }

    &__controls {
      display: flex;
      justify-content: space-around;

      > .action-btn {
        flex-basis: 30%;
      }
    }
  }

</style>
