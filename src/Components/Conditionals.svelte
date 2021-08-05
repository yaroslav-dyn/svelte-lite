<script>

  //Local variables
  const pageAlias = 'conditionals';
  const pageTitle = 'Conditionals';

  //Props
  export let isThisPage = ''

</script>
{#if isThisPage === pageAlias}
  <div class="personal_component">

    <h1 class="main-heading center-text"> {pageTitle} </h1>
    <br />


  </div>
{/if}

<style lang="scss">

</style>
