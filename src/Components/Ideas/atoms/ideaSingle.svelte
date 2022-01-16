<div>
  <h2 class="group_header" contenteditable="true">{singleIdea.group}</h2>
  <div>
    <textarea
        class="idea_letter custom-input area"
        name="idea"
        on:change={changeIdea}
        bind:value={singleIdea.text}/>
  </div>
</div>

<script lang="ts">
  export let singleIdea = null;
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();

  const changeIdea = () => {
    dispatch('editIdea', singleIdea)
  }



</script>

<style lang="scss">
  .group_header {
    font-size: 1.8rem;
    padding: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    margin: 0;
  }

  .idea_letter {
    width: 100%;
    height: 68vh;
    border: none;
    box-shadow: 0 0 1px rgb(0,0,0,.6);
    &:focus {
      outline: none;
      background-color: #f6f6f6;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.6);
    }
  }
</style>
