<script lang="ts">
    import Note from "./Components/Note.svelte";
    import AddModal from "./Components/Memos/add-modal.svelte";
    import ConfirmModal from "./Components/_common/confirm-modal.svelte";
    import {onMount} from "svelte";
    import {getApiResponse} from "../Services/api";
    import {SvelteToast, toast} from '@zerodevx/svelte-toast';
    import {showToast} from '../Services/toastService'

    /* DATA  */
    //@ts-ignore
    let Memos = [];
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
        Memos = await getApiResponse('memos', "GET", null, false);
    }
    const confirmDeleting = (e) =>  {
      confirmModal = {title: 'Warning', message: 'You want to delete note?', controls: true, data: e}
    }
    const deleteMemo = async (data) => {
        const params = data.detail;
        const resp = await getApiResponse(`memo/${params.id}`, "DELETE", null, false);
        if (resp) {
            triggerConfirmModal(false);
            toast.push('Note has been deleted!'  , {theme: {
                '--toastBackground': '#48BB78',
                '--toastBarBackground': '#2F855A'}
            })
            await getDefaultMemos();
        } else {
            toast.push("Note hasn't been deleted!"  , {theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
            }})
        }

    }
    /* end Methods */

    onMount(async () => {
        await getDefaultMemos();
        apiStatus = await getApiResponse('status', 'GET', null, true)
        //@ts-ignore
        Memos = await getApiResponse('memos', 'GET', null, false);

        showToast();
    });


</script>

<!-- HTML-->
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
            on:onNoteDelete={confirmDeleting}
        />
    {/each}
</article>

{ #if showAddModal}
    <AddModal on:addMemo={createNewMemo} on:closeModal={ triggerModal}/>
{/if}

<SvelteToast />

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

<!-- END HTML-->

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
