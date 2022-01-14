<div class="base_modal {customClass}">
  <div class="base_modal__content"
       transition:fly="{{ y: 200, duration: 300 }}">
    <slot></slot>
  </div>
</div>

<script lang="ts">
  import {fly} from 'svelte/transition';
  export let customClass = ''
</script>

