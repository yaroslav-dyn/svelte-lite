<script>
  //imports


  //Local variables
  const pageAlias = 'typical';
  const pageTitle = 'Typical'

  let projectInfo = {
    name: 'API examples',
    pageTitle: 'Typical API',
    url: 'git@github.com:yaroslav-dyn/svelte-lite.git',
    author: 'yaroslav@webdev',
    company: ''
  }

  //Props
  export let isThisPage = ''

  //Computed variables

</script>

{#if isThisPage === pageAlias}
  <div class="personal_component">

      <h1 class="main-heading center-text"> {pageTitle} </h1>

  </div>
{/if}

<style lang="scss">

</style>
