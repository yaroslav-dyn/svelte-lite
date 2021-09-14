<script lang="ts">
	export let name = '';
	export let description = ''
	export let orderNumber = 0;
</script>



<div class="personal-cart" on:click>
  <div>{orderNumber}.</div>
  <div>{name}</div>
  <hr>
  <div>{description}</div>
</div>


<style>
	.personal-cart {
    display: flex;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 4px rgba(0,0,0, 0.6);
    padding: 1rem;
    margin-bottom: 8px;
  }
</style>
