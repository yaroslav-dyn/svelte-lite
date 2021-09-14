<script lang="ts">
  import Note from "./Components/Note.svelte";
  import AddModal from "./Components/Memos/add-modal.svelte";
  import {onMount} from "svelte";
  import {getApiResponse} from "../Services/api";

  /* DATA  */
  let Memos = [];
  let apiStatus = null;
  let showAddModal = false
  /* END DATA  */

  // $: validForm = checkFields(fullName);
  //let checkFields = (fName) => fName && fName.length < 3;

  /* Methods */
  let clickOnCart = (ev) => console.log('click on personal', ev);

  /* end Methods */

  onMount(async () => {
    const apiStatRes = await getApiResponse('status', "GET", null, true);
    apiStatus = apiStatRes && apiStatRes;
    //@ts-ignore
    Memos = await getApiResponse('memos', "GET", null, false);
  })

  const createNewMemo = async (memo) => {
    const params = memo.detail.memoForm;
    const resp = await getApiResponse('memo', "POST", params, false);
    console.log(
        'create', resp
    )
  }

</script>

<main>

  <header>
    <div class={apiStatus && apiStatus.status > 300 ? 'api_status error' : 'api_status success'}>
      {apiStatus && apiStatus.status} {apiStatus && apiStatus.statusText}
    </div>
  </header>


</main>

<article>
  <div>
    <button class="action-btn" on:click={()=> showAddModal = !showAddModal}>Add Memo</button>
  </div>
  {#each Memos as note, i }
    <Note name={note.name} description="{note.description}" orderNumber={i+1} on:click={clickOnCart} />
  {/each}
</article>


{ #if showAddModal}
  <AddModal on:addMemo="{createNewMemo}"/>
{/if}

<style lang="scss">
  main {
    padding: 1em;
  }

  .api_status {
    font-size: 12px;
    font-weight: 100;
    background-color: #f8f8f8;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
    display: inline-block;
    padding: 8px 14px;
    border-radius: 8px;
  }

  .api_status.error {
    color: darkred;
  }

  .api_status.success {
    color: green;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
