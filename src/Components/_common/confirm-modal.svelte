<div class="base_modal confirm_modal">

    <div class="base_modal__content">

        <h3 class={'base_modal__title ' + confirmType}>
            {title}
        </h3>

        <p class="base_modal__message">
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

<style>

  .base_modal__title {
    font-size: 1.8rem;
    margin: 0;
    padding: 1.2rem;
    text-align: center;
  }

  .base_modal__title.normal {
    color: #000;
  }

  .base_modal__title.warning {
    color: darkorange;
  }

  .base_modal__title.error {
    color: darkred;
  }

  .base_modal__message {
    margin: 0;
    padding: 1.1rem;
  }

  .base_modal__controls {
    display: flex;
    justify-content: space-around;
  }
  .base_modal__controls > .action-btn {
    flex-basis: 30%;
  }

</style>
