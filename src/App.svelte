<!-- HTML-->
<div class="memo-app">

  <Header apiStatus={apiStatus}/>

  <main class="main_area">
    <section class="section_item">
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
              on:click={getOneMemoById(note._id)}
              on:onNoteDelete={confirmDeleting}
          />
        {/each}
      </article>
    </section>

    {#if Memo}
      <section class="section_item" transition:fade="{{delay: 250, duration: 300}}">
        <MemoPreview note={Memo}/>
      </section>
    {/if}

  </main>


  <!--  Modals -->
  { #if showAddModal}
    <AddModal on:addMemo={createNewMemo} on:closeModal={ triggerModal}/>
  {/if}

  {#if confirmModal}
    <ConfirmModal
        title={confirmModal.title}
        message={confirmModal.message}
        hasControls={confirmModal.controls}
        confirmType="warning"
        on:confirmAction={ deleteMemo(confirmModal.data) }
        on:closeModal={ triggerConfirmModal}
    />
  {/if}


  <SvelteToast/>

</div>

<!-- END HTML-->


<script>
  import Header from "./Components/_common/Header.svelte"
  import Note from "./Components/Note.svelte";
  import MemoPreview from "./Components/Memos/memo-preview.svelte"
  import AddModal from "./Components/Memos/add-modal.svelte";
  import ConfirmModal from "./Components/_common/confirm-modal.svelte";
  import {onMount} from "svelte";
  import {getApiResponse} from "../Services/api";
  import {SvelteToast, toast} from '@zerodevx/svelte-toast';
  import {showToast} from '../Services/toastService';
  import {fade} from 'svelte/transition';

  /* DATA  */
  //@ts-ignore
  let Memos = [];
  let Memo = null;
  let apiStatus = null;
  let showAddModal = false;
  let confirmModal = null;
  /* END DATA  */

  /* Methods */

  const createNewMemo = async (memo) => {
    const params = memo.detail.memoForm;
    const resp = await getApiResponse('memo', "POST", params, false);
    if (resp && !resp.errors) {
      triggerConfirmModal(false);
      showToast('Note has been added!', 'successTheme');
      await getDefaultMemos();
    } else {
      showToast(`Note hasn't been added! ${resp.errors.map(er => er.msg)}`, 'warningTheme');
    }
    triggerModal(false);
  }
  const triggerModal = (status) => {
    showAddModal = status ? status.detail : false;

  }
  const triggerConfirmModal = (status) => {
    confirmModal = status ? status.detail : false;
  }
  const getDefaultMemos = async () => {
    //@ts-ignore
    Memos = await getApiResponse('memos', 'GET', null, false);
  }

  const getOneMemoById = async (id) => {
    console.log(id, 'lfkdj');
    Memo = await getApiResponse(`memo/${id}`, 'GET', null, false);
  }

  const confirmDeleting = (e) => {
    confirmModal = {title: 'Warning', message: 'You want to delete note?', controls: true, data: e}
  }
  const deleteMemo = async (data) => {
    const params = data.detail;
    const resp = await getApiResponse(`memo/${params.id}`, "DELETE", null, false);
    if (resp) {
      triggerConfirmModal(false);
      showToast("Note has been deleted!", 'successTheme');
      await getDefaultMemos();
    } else showToast("Note hasn't been deleted!", 'warningTheme');
  }
  /* end Methods */

  onMount(async () => {
    await getDefaultMemos();
    apiStatus = await getApiResponse('status', 'GET', null, true)
    //@ts-ignore
    Memos = await getApiResponse('memos', 'GET', null, false);
  });


</script>

<style>
  main {
    padding: 1em;
  }

  .main_area {
    display: flex;
    flex-direction: row;
  }

  .main_area > .section_item {
    flex: 1;
    padding: 2rem;
  }

  .main_area > .section_item:last-child {
    flex: 0 1 auto;
  }

  @media (min-width: 640px) {
    .main_area {
      max-width: none;
      flex-direction: row;
    }
  }
</style>
