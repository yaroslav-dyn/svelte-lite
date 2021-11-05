<div class="base_modal confirm_modal">

  <div class="base_modal__content">
    <div>
      <h3 class={`base_modal__title ${confirmType}`}>
        {title}
      </h3>

      <p class="base_modal__message centered-text">
        {message}
      </p>
    </div>
    {#if hasControls}
      <div class="base_modal__controls">
        <button class="action-btn warn" on:click={closeAction}>No</button>
        <button class="action-btn success" on:click={confirmAction}>Yes</button>
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
    &__content {
      @media screen and (max-width: $medium-device) {
        width: 100%;
        top: 0;
        left: 0;
      }
    }
    &__title {
      font-size: 1.8rem;
      margin: 0;
      padding: 1.2rem;
      text-align: center;

      &.normal {
        color: #000;
      }

      &.warning {
        color: $warning-text;
      }

      &.error {
        color: $error-text;
      }
    }

    &__message {
      margin: 0;
      padding: 1.1rem;
    }

    &__controls {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      padding: 1.4rem 0;
      > .action-btn {
        flex-basis: 30%;
      }
    }
  }

</style>
