<script lang="ts">
  import {onMount} from 'svelte';
  import {getApiResponse} from "../Services/api";
  import Header from '../Components/_common/Header.svelte';

  /* DATA  */
  let apiStatus = null;


  onMount(async () => {
    apiStatus = await getApiResponse("status", "GET", null, true);
  })
</script>

<!-- Template -->
<Header {apiStatus}/>
<slot/>
<!-- end template -->
