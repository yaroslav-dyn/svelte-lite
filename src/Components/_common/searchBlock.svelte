<input
    type="text"
    class="custom-input search"
    placeholder="Search by name"
    on:keyup={({ target: { value } }) => debounceValue(value)}>


<script lang="ts">
  import {createEventDispatcher} from "svelte";

  let timer = null;
  const debounceTime:number = 750;

  const dispatch = createEventDispatcher();

  export const debounceValue = async (str) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch('searchQuery', str)
    }, debounceTime);
  }

</script>
