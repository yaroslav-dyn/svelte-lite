<a href="{refUrl}" class="{linkClass} {isActive ? 'active' : ''}">
  <slot />
  {#if iconSymbol}
    <span class="material-icons {iconClass}">{iconSymbol}</span>
  {/if}
</a>

<script lang="ts">
  import { page } from "$app/stores"

  export let refUrl = '/';
  export let linkClass = '';
  export let iconClass = '';
  export let iconSymbol:string|null = null;

  $: isActive = $page.url.pathname === refUrl;

</script>
