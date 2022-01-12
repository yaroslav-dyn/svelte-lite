<svelte:head>
  <title>Memos</title>
</svelte:head>

<MemoIndex />

<script>
  import MemoIndex from "../Components/Memos/MemoIndex.svelte"
</script>

<style lang="scss">
  @import "../scss/vars";
  main {
    padding: 1em;
  }

  .main_area {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    @media only screen and(max-width: $small-device) {
      padding: 2rem 1rem;
    }

    > :global(.section_item) {
      flex: 1;

      &.view_item {
        flex: 0 1 auto;
      }
    }
  }

</style>
