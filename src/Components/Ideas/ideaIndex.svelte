<main class="main_area main-column">
  <section class="section_item">
    {#if currentLetter}
      <SingleIdea singleIdea={currentLetter}/>
    {/if}
    <div class="group_motion flex-grid justify-s-side-in adjust-center">
      <div class="group_motion__item add" on:click={() => triggerModal(true, 'addModal')}>
        <span class="material-icons action-icon">add</span>
      </div>
      <div class="group_motion__list">
        {#each Letters as letter }
          <div class="group_motion__item {letter.group === currentLetter.group ? 'active': ''}"
               on:click={()=>setCategory(letter)}>
            <span class="group_motion__label"> {letter.group.substring(0, 2)} </span>
          </div>
        {/each}
      </div>
      <span class="material-icons action-icon"
            on:click={() => triggerModal(true, 'controlsModal')}>more_vert</span>
    </div>
  </section>
</main>

<!--  Modals -->
{#if modalsState.addModal}
  <AddIdeaModal
    on:addIdea={createNewIdea}
    on:closeModal={(e)=> triggerModal(e, 'addModal')}
  />
{/if}

{#if modalsState.controlsModal}
  <BaseModal customClass="idea__nav--bottom">
    <IdeaControls
      on:onClose={()=> triggerModal(false, 'controlsModal')}
      on:ideaAction={onIdeaAction} />
  </BaseModal>
{/if}

{#if confirmModal}
  <ConfirmModal
    title={confirmModal.title}
    message={confirmModal.message}
    hasControls={confirmModal.controls}
    confirmType="warning"
    on:confirmAction={deleteIdea(currentLetter)}
    on:closeModal={()=> confirmModal= null}
  />
{/if}

<SvelteToast/>

<script lang="ts">
  import SingleIdea from './atoms/ideaSingle.svelte';
  import AddIdeaModal from './_common/add-idea-modal.svelte';
  import BaseModal from '../_common/base-modal.svelte';
  import {onMount} from "svelte";
  import {getApiResponse} from "../../Services/api";
  import {IdeasItem} from "../../Interfaces/General";
  import {showToast} from "../../Services/toastService";
  import {SvelteToast} from "@zerodevx/svelte-toast";
  import IdeaControls from "./_common/IdeaControls.svelte";
  import ConfirmModal from "../../Components/_common/confirm-modal.svelte";


  let Letters: IdeasItem[] = [];
  let currentLetter: IdeasItem | null = null;
  let modalsState = {
    addModal: false,
    controlsModal: false
  }
  let confirmModal = null;
  const triggerModal = (status: CustomEvent | boolean, key?: string) => {
    if (typeof status !== "boolean") {
      modalsState[key] = status?.detail || false;
    } else modalsState[key] = status
  };

  const createNewIdea = async (idea) => {
    const params = idea.detail.ideaForm;
    const resp = await getApiResponse("idea", "POST", params, false);
    if (resp && !(!!resp.errors || !!resp.error)) {
      showToast("Idea has been added!", "successTheme");
      await getDefaultIdeas(null);
    } else {
      const errorString = resp.error ? resp.error
          : resp.errors.map((er) => er.msg.concat());
      showToast(
          `Idea hasn't been added! resp.error ${errorString}`,
          "warningTheme"
      );
    }
    triggerModal(false, 'addModal');
  };
  const setCategory = (letter) => {
    currentLetter = letter;
  };

  const getDefaultIdeas = async (param: string) => {
    const setUrl = param ? `ideas?${param}` : "ideas";
    Letters = await getApiResponse(setUrl, "GET", null, false);
    currentLetter = Letters[0]
  };

  const confirmDeleting = (e) => {
    console.log(e, 'e');
    confirmModal = {
      title: "Warning",
      message: "You want to delete this idea?",
      controls: true,
      data: e,
    };
  };


  const deleteIdea = async (data): Promise<void> => {
    const resp = await getApiResponse(
        `idea/${data._id}`,
        "DELETE",
        null,
        false
    );
    if (resp) {
      confirmModal = null;
      showToast("Idea has been deleted!", "successTheme");
      await getDefaultIdeas('');
    } else showToast("Idea hasn't been deleted!", "warningTheme");
  }

  const onIdeaAction = (action) => {
    switch (action.detail.type) {
      case 'delete':
        confirmDeleting(currentLetter);
        break;
    }
    triggerModal(false, 'controlsModal')
  }

  onMount(async () => {
    await getDefaultIdeas('');
  });

</script>

<style lang="scss">
  @import "./src/scss/vars";

  .main_area {
    padding: 1rem;
  }

  .group_motion {
    &__list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow-x: auto;
      margin: 0 2px;
    }

    &__item {
      border: 2px solid #1091cb;
      border-radius: 6px;
      padding: 8px;
      margin-right: 0.5rem;
      cursor: pointer;

      &.add {
        padding: 4px 6px;
      }

      &.active {
        background-color: #1091cb;
        color: #fff;
      }
    }

    &__label {
      text-transform: uppercase;
    }
  }

  :global {
    .idea__nav {
      &--bottom {
        .base_modal__content {
          bottom: 0;
          top: unset;
        }
      }
    }
  }

</style>
