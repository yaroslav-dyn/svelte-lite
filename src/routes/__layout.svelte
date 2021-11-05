<script lang="ts">
  import {onMount} from 'svelte';
  import {getApiResponse} from "../Services/api";
  import Header from '../Components/_common/Header.svelte';
  import Footer from '../Components/_common/Footer.svelte';
  /* DATA  */
  let apiStatus = null;
  onMount(async () => {
    apiStatus = await getApiResponse("status", "GET", null, true);
  })
</script>


<!-- Template -->
<div class="app-wrapper">
  <Header class="main-column" {apiStatus}/>

  <slot class="main-column" />

  <Footer class="main-column"  />
</div>


<!-- end template -->
