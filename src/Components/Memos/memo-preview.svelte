<div class="memo_preview">

  <div class="memo_preview__inner">

    <button class="action-btn success w100" on:click={updateNote}>
      Update
    </button>

    <div class="memo_status-box">
      <span>
       Status:
      </span>
      <input class="memo_status-box" id="memo-status" type="checkbox"
             bind:checked={note.status}>
    </div>

    <div>
      <label for="memo-name"><b>Name:</b></label>
      <input id="memo-name" type="text" class="custom-input"
        bind:value={note.name}>
    </div>

    <div>
      <label for="memo-description"><b>Name:</b></label>
      <textarea
          class="custom-input area description_field"
          rows="4"
          id="memo-description"
          name="description"
          style="resize: none"
          bind:value={note.description}></textarea>
    </div>

    <div>
      <small>
        <i class="material-icons">schedule</i>
      </small>
      {formatedDate}
    </div>

  </div>

</div>

<script>
import dayjs from "dayjs"
import {createEventDispatcher} from "svelte";

  export let note = null;
  $:formatedDate = note && dayjs(note.updatedAt).format('DD.MM.YYYY, HH:mm');

  const dispatch = createEventDispatcher();

  const updateNote = () => {
    dispatch('updateNote', note)
  }

</script>

<style>
  .memo_preview {
    /*background: #f6f6f6;*/
  }
  .memo_preview__inner {
    background: #fff;
    padding: 1.4rem;
    border-radius: 4px;
  }
  .memo_status-box {
    display: flex;
  }

</style>
