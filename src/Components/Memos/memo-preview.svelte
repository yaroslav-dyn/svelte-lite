<div class="memo_preview">
  <div class="memo_preview__inner">
    <div>
      <label class="custom-label m_preview-label" for="memo-name"><b>Title:</b></label>
      <input
        id="memo-name"
        type="text"
        class="custom-input"
        bind:value={note.name}
      />
    </div>

    <div>
      <label class="custom-label m_preview-label" for="memo-description"><b>Description:</b></label>
      <textarea
          class="custom-input area description_field"
          rows="4"
          id="memo-description"
          name="description"
          bind:value={note.description}
      />
    </div>

    <div>
      <div class="flex-grid adjust-center justify-s-side-in memo_status-box__time-edit">
        <div class="memo_status-box">
<!--          <span class="memo_status-box__label">Status:</span>-->

          <MemoStatusesView
              statusMemo="{note.status}"
              on:changeStatusInput={onChangeStatusMemo}
          />

        </div>

        <div class="flex-grid adjust-center">
          <i class="material-icons">schedule</i>
          {formatedDate}
        </div>
      </div>
    </div>

    <button class="action-btn success w100" on:click={updateNote}>
      Update
    </button>

    <button class="action-btn warn w100" on:click={() => dispatch('closeView')}>
      close
    </button>
  </div>
</div>

<script>
  import dayjs from "dayjs";
  import MemoStatusesView from '../_common/atoms/memoStatusesView.svelte';
  import {createEventDispatcher} from "svelte";

  export let note = null;
  $: formatedDate = note && dayjs(note.updatedAt).format("DD.MM.YYYY, HH:mm");

  const dispatch = createEventDispatcher();


  const onChangeStatusMemo = (status) => {
    note.status = status.detail;
  }

  const updateNote = () => {
    dispatch("updateNote", note);
  };
</script>

<style lang="scss">
  @import "../../scss/vars";

  .memo_preview {
    border-radius: 3px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  }

  .memo_preview__inner {
    background: #fff;
    padding: 1.4rem;
    border-radius: 4px;
  }

  .memo_status-box {
    display: flex;
    align-items: center;

    &__label {
      margin-right: 10px;
      display: inline-block;
    }

    &__input {
      margin: 0;
    }

    &__time-edit {
      padding: 14px 0;
    }
  }
  .m_preview-label {
    margin-bottom: 0.8rem;
    opacity: 0.9;
  }
</style>
