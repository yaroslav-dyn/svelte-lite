<!-- HTML-->
<main class="main_area main-column">
  {#if !Memo}
    <section class="section_item"
             transition:fade="{{delay: 50, duration: 150}}">
      <article>

        <div class="memos_controls">
          <button
              class="action-btn mobile100 add_btn"
              on:click={() => triggerModal({detail: true})}>
            Add Memo
          </button>
          <SearchBlock on:searchQuery={searchNote}/>
        </div>

        <div class="memos_list">
          {#each Memos as note, i}
            <Note
                name={note.name}
                description={note.description}
                orderNumber={i + 1}
                status={note.status}
                noteID={note._id}
                on:click={getOneMemoById(note._id)}
                on:onNoteDelete={confirmDeleting}
            />
          {/each}
        </div>

      </article>
    </section>

  {:else if Memo}
    <section
        class="section_item view_item"
        transition:slide="{{delay: 200, duration: 150, easing: bounceInOut}}">
      <MemoPreview note={Memo} on:updateNote={updateMemo} on:closeView={closePreview}/>
    </section>
  {/if}
</main>

<!--  Modals -->
{#if showAddModal}
  <AddModal on:addMemo={createNewMemo} on:closeModal={triggerModal}/>
{/if}

{#if confirmModal}
  <ConfirmModal
      title={confirmModal.title}
      message={confirmModal.message}
      hasControls={confirmModal.controls}
      confirmType="warning"
      on:confirmAction={deleteMemo(confirmModal.data)}
      on:closeModal={triggerConfirmModal}
  />
{/if}

<SvelteToast/>

<script lang="ts">
  import {slide, fade} from 'svelte/transition';
  import {bounceInOut} from 'svelte/easing';
  import {SvelteToast} from "@zerodevx/svelte-toast";
  import {onMount} from "svelte";
  import {getApiResponse} from "../../Services/api";
  import {showToast} from "../../Services/toastService";
  import AddModal from "../../Components/Memos/add-modal.svelte";
  import MemoPreview from "../../Components/Memos/memo-preview.svelte";
  import Note from "../../Components/Memos/Note.svelte";
  import ConfirmModal from "../../Components/_common/confirm-modal.svelte";
  import SearchBlock from "../../Components/_common/searchBlock.svelte";
  import {MemosItem} from "../../Interfaces/General";

  /* DATA  */
  //@ts-ignore
  let Memos: MemosItem[] = [];
  let Memo: MemosItem = null;
  let apiStatus = null;
  let showAddModal = false;
  let confirmModal = null;
  /* END DATA  */

  /* Methods */
  const createNewMemo = async (memo) => {
    const params = memo.detail.memoForm;
    const resp = await getApiResponse("memo", "POST", params, false);

    if (resp && !(!!resp.errors || !!resp.error)) {
      triggerConfirmModal(false);
      showToast("Note has been added!", "successTheme");
      await getDefaultMemos(null);
    } else {
      const errorString = resp.error ? resp.error
          : resp.errors.map((er) => er.msg.concat());
      showToast(
          `Note hasn't been added! resp.error ${errorString}`,
          "warningTheme"
      );
    }
    triggerModal(false);
  };
  const updateMemo = async (e) => {
    let {name, description, status} = e.detail;
    let memoId = e.detail._id;
    const resp = await getApiResponse(
        `memo/${memoId}`,
        "PUT",
        {name, description, status},
        false
    );
    if (resp && !(!!resp.errors || !!resp.error)) {
      showToast("Note has been Updated!", "successTheme");
      Memo = null;
      await getDefaultMemos(null);
    } else {
      const errorString = resp.error
          ? resp.error
          : resp.errors.map((er) => er.msg.concat());
      showToast(
          `Note hasn't been updated! resp.error ${errorString}`,
          "warningTheme"
      );
    }
  };
  const closePreview = () => {
    Memo = null;
  };
  const triggerModal = (status) => {
    showAddModal = status ? status.detail : false;
  };
  const triggerConfirmModal = (status) => {
    confirmModal = status ? status.detail : false;
  };
  const getDefaultMemos = async (param: string) => {
    const setUrl = param ? `memos?${param}` : "memos";
    Memos = await getApiResponse(setUrl, "GET", null, false);
  };
  const getOneMemoById = async (id: string) => {
    if (Memo && Memo._id === id) Memo = null;
    else Memo = await getApiResponse(`memo/${id}`, "GET", null, false);
  };
  const confirmDeleting = (e) => {
    confirmModal = {
      title: "Warning",
      message: "You want to delete note?",
      controls: true,
      data: e,
    };
  };
  const deleteMemo = async (data): Promise<void> => {
    const params = data.detail;
    const resp = await getApiResponse(
        `memo/${params.id}`,
        "DELETE",
        null,
        false
    );
    if (resp) {
      triggerConfirmModal(false);
      showToast("Note has been deleted!", "successTheme");
      await getDefaultMemos(null);
    } else showToast("Note hasn't been deleted!", "warningTheme");
  };
  const searchNote = async (e) => {
    await getDefaultMemos(`name=${e.detail}`);
  };
  /* end Methods */

  onMount(async () => {
    await getDefaultMemos(null);
  });
</script>

<style lang="scss">
  @import "../../scss/vars";

  .add_btn {
    padding: 14px 6px;
    margin-bottom: 2rem;
  }

  @media (max-width: $desktop-device) {
    .add_btn {
      padding: 14px 6px;
      margin-bottom: 1rem;
    }
  }

  .memos {
    &_controls {
      position: sticky;
      top: 86px;
    }

    &_list {
      max-height: calc(100vh - 300px);
      overflow-y: auto;
      padding: 0.8rem 0.2rem;
    }
  }
</style>
