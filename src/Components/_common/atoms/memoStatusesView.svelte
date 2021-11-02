<label for="status">Status:</label>
<label for="status" class="flex-grid adjust-center">
  <input class="status_input" id="status" type="checkbox" on:change={emitStatus}>
  <i class="material-icons status {statusMemoInput ? 'complete' : 'pending'}">
    radio_button_unchecked
  </i>
  <span class="status-label {statusHru}">{statusHru}</span>
</label>

<script lang="ts">
  import {createEventDispatcher, onMount} from "svelte";

  export let statusMemo = false;
  let statusMemoInput = false;
  $: statusHru = statusMemoInput ? "––Complete" : "––Pending";

  const dispatch = new createEventDispatcher();

  const emitStatus = (e) => {
    statusMemoInput =  e.target.checked;
    dispatch('changeStatusInput', statusMemoInput)
  }

  onMount(() => {
    statusMemoInput = statusMemo;
  });

</script>
<style lang="scss">
  @import '../../../scss/vars.scss';
  .status_input {
    display: none;
  }
  .status-label {
    display: inline-block;
    margin-left: 4px;
    font-size: 14px;
    &.––Complete {
      color: $success-text
    }
    &.––Pending {
      color: $warning-text
    }
  }

</style>
