<div class="idea_controls__modal">
  <div class="flex-grid justify-center" on:click={()=>dispatch('onClose')}>
    <span class="material-icons action-icon">expand_more</span>
  </div>
  <nav class="idea_controls__modal--nav" on:click={()=> runAction({type: 'delete'})}>
    <div class="nav_icon">
      <span class="material-icons action-icon">delete</span>
    </div>
    <div class="nav_text">
      delete
    </div>
  </nav>
</div>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();

  const runAction = (params: CustomEvent) => {
    dispatch('ideaAction', params);
  }
</script>

<style lang="scss">
  @import './src/scss/vars';
  .idea_controls__modal {
    &--nav {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .nav_icon {
        flex-basis: 10%;
      }
      .nav_text {
        flex-basis: 90%;
      }
    }
  }
</style>
