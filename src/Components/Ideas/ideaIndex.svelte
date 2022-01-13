<main class="main_area main-column">
    <section class="section_item">
      {#if currentLetter}
        <SingleIdea singleIdea={currentLetter} />
      {/if}
      <ul class="group_motion">
        <li class="group_motion__item add" on:click={() => triggerModal({detail: true})}>
          <span class="material-icons">add</span>
        </li>
        {#each Letters as letter }
          <li class="group_motion__item {letter.group === currentLetter.group ? 'active': ''}"
              on:click={()=>setCategory(letter)}>
            <span class="group_motion__label"> {letter.group.substring(0, 2)} </span>
          </li>
        {/each}
      </ul>
    </section>
</main>

<!--  Modals -->
{#if showAddModal}
  <AddIdeaModal on:addIdea={createNewIdea} on:closeModal={triggerModal}/>
{/if}


<script lang="ts">
  import SingleIdea from './atoms/ideaSingle.svelte';
  import AddIdeaModal from './_common/add-idea-modal.svelte';
  import {onMount} from "svelte";
  import {getApiResponse} from "../../Services/api";
  import {IdeasItem} from "../../Interfaces/General";

  /** TODO: mockup debug data **/
  let Letters: IdeasItem[] = [];
  let currentLetter: IdeasItem|null = null;
  /** **/

  let showAddModal = false

  const triggerModal = (status) => {
    showAddModal = status ? status.detail : false;
  };

  const setCategory = (letter) => {
    currentLetter = letter;
    console.log(currentLetter);
  };

  const createNewIdea = async (idea) => {
    console.log(
        'create idea', idea
    );
  }

  const getDefaultIdeas = async (param: string) => {
    const setUrl = param ? `ideas?${param}` : "ideas";
    Letters = await getApiResponse(setUrl, "GET", null, false);
    currentLetter = Letters[0]
  };

  onMount(async () => {
    await getDefaultIdeas('');
  });

</script>

<style lang="scss">
  .main_area {
    padding: 1rem;
  }

  .group_motion {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    list-style: none;
    padding: 0;
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

</style>
