<script lang="ts">
  import Note from "./Components/Note.svelte";
  import AddModal from "./Components/Memos/add-modal.svelte";
  import {onMount} from "svelte";
  import {getApiResponse} from "../Services/api";

  /* DATA  */
  //@ts-ignore
  let Memos = [];
  let apiStatus = null;
  let showAddModal = false
  /* END DATA  */

  /* Methods */
  let clickOnCart = (ev) => console.log('click on personal', ev);

  const createNewMemo = async (memo) => {
    const params = memo.detail.memoForm;
    const resp = await getApiResponse('memo', "POST", params, false);
    if (resp) {
      await getDefaultMemos();
      alert('Note has been created!');
    }
  }

  const triggerModal = (status) => {
    showAddModal = status.detail
  }

  const getDefaultMemos = async () => {
    //@ts-ignore
    Memos = await getApiResponse('memos', "GET", null, false);
  }

  const deleteMemo = async (e) => {
    const params = e.detail;
    const resp = await getApiResponse(`memo/${params.id}`, "DELETE", null, false);
    if (resp) {
      alert('Note has been deleted!');
      await getDefaultMemos();
    }

  }

  /* end Methods */

  onMount(async () => {
    await getDefaultMemos();
    apiStatus = await getApiResponse('status', 'GET', null, true)
    //@ts-ignore
    Memos = await getApiResponse('memos', 'GET', null, false);
  });


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
    <button class="action-btn" on:click={()=> showAddModal = true}>Add Memo</button>
  </div>
  {#each Memos as note, i }
    <Note
        name={note.name}
        description={note.description}
        orderNumber={i+1}
        status={note.status}
        noteID={note._id}
        on:onNoteDelete={deleteMemo}
    />
  {/each}
</article>


{ #if showAddModal}
  <AddModal on:addMemo={createNewMemo} on:onClose={ triggerModal}/>
{/if}

<style>
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
