<script>
  //imports
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  //Local variables

  const pageAlias = 'events';
  const pageTitle = 'Events'


  //Props
  export let isThisPage = ''

  const onEmitSomeEvent = () => dispatch('emitSomeEvent', `event from ${pageTitle}`);

</script>

{#if isThisPage === pageAlias}
  <div class="personal_component">

    <h1 class="main-heading center-text"> {pageTitle} </h1>

    <button class="action-btn" on:click|self={onEmitSomeEvent}>Emit event</button>

  </div>
{/if}

<style lang="scss">

</style>
