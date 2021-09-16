<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    export let name = '';
    export let description = '';
    export let orderNumber = 0;
    export let status = false;
    export let noteID = null;
    const dispatch = createEventDispatcher();
    let statusHru = "";

    $: statusHru = status ? 'Complete' : 'Pending'

    /*
      Methods
    */
    const onDeleteItem = (id) => {
        dispatch('onNoteDelete', {id})
    }

</script>

<div class="personal-cart">
    <div class="header_cart" on:click>{orderNumber}. &nbsp;{name}</div>
    <div>{description || ''}</div>
    <div class="status {status ? 'complete' : 'pending'}">{statusHru}</div>
    <div>
        <i on:click|self={onDeleteItem(noteID)} class="memo-icons icon_close attention"></i>
    </div>
</div>


<style>
  .personal-cart {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
    padding: 1.4rem;
    margin-bottom: 4px;
  }
  .personal-cart > div:first-child {
    flex-basis: 40%;
  }
  .personal-cart > div:not(:first-child) {
    flex-basis: 20%;
  }
  .personal-cart > div:last-child {
    text-align: right;
  }

  .header_cart {
    cursor: pointer;
  }

  .status.complete {
    color: green
  }

  .status.pending {
    color: orangered
  }
</style>
