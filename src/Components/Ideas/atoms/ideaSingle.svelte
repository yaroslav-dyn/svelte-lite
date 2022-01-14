<div>
  <h2 class="group_header" contenteditable="true">{singleIdea.group}</h2>
  <div>
    <textarea
        class="idea_letter custom-input area"
        name="idea"
        on:input={changeIdea}
        bind:value={singleIdea.text}/>
  </div>
</div>

<script lang="ts">
  import { debounceValue } from './Services/';
  export let singleIdea = null;

  const changeIdea = (e) => {
    console.log('change', e);
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
