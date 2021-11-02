<div class="personal-cart">
  <div class="header_cart" on:click|self>{orderNumber}. &nbsp;{name}</div>
  <div class="hide-mobile">{description || ""}</div>
  <div class="status hide-mobile {status ? 'complete' : 'pending'}">
    {statusHru}
  </div>
  <div class="hide-desktop">
    <i class="material-icons status {status ? 'complete' : 'pending'}">
      radio_button_unchecked
    </i>
  </div>
  <div>
    <i class="material-icons memo-icons icon_close attention"
      on:click|self={onDeleteItem(noteID)}>
      clear
    </i>
    <!-- <i on:click|self class="material-icons memo-icons icon_close">launch</i> -->
  </div>
</div>

<script lang="ts">
  import {createEventDispatcher} from "svelte";

  export let name = "";
  export let description = "";
  export let orderNumber = 0;
  export let status = false;
  export let noteID = null;
  const dispatch = createEventDispatcher();

  $: statusHru = status ? "Complete" : "Pending";

  /** Methods **/
  const onDeleteItem = (id: string) => {
    dispatch("onNoteDelete", {id});
  };
</script>

<style lang="scss">
  @import "../scss/vars";

  .personal-cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
    padding: 1.4rem;
    margin-bottom: 6px;
  }

  .personal-cart {
    > div {
      margin-right: 10px;
    }

    & > div:first-child {
      flex-basis: 40%;
    }

    & > div:not(:first-child) {
      flex-basis: 20%;
    }

    & > div:last-child {
      text-align: right;
    }
  }

  .header_cart {
    cursor: pointer;
  }

  @media screen and (max-width: $medium-device) {
    .personal-cart {
      & > div:first-child {
        flex-basis: 90%;
      }

      & > div:not(:first-child) {
        flex-basis: 5%;
      }

      & > div:last-child {
        text-align: right;
      }
    }
  }
</style>
