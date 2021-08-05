<script>
  /*Main component*/
  import {onMount} from "svelte";

  //Components
  import Header from "./Components/Common/Header.svelte";
  import Footer from "./Components/Common/Footer.svelte";
  import Typical  from "./Components/Typical.svelte";
  import Circles  from "./Components/Circles.svelte";
  import Conditionals  from "./Components/Conditionals.svelte";
  import Events  from "./Components/Events.svelte";

  //variables
  let currentPage = 'typical';
  let formModel = null;

  //Methods
  const getCurrentPage = () => {
    const cp = localStorage.getItem('currentPage');
    if (cp) currentPage = cp;
  }

  const setCurrentAlias = (e) => {
   localStorage.setItem('currentPage', e.target.value);
  }

  const catchSomeEvent = (params) => {
    console.log( 'catchSomeEvent', params.detail);
  }

  //Time hooks
  onMount(() => {
    getCurrentPage();
  });

</script>

<div class="wrapper-block">
  <Header/>
  <main class="main-block">
    <div class="pages-container">

      <div class="pages-container--controls">
        <form name="pages-selector" on:change={setCurrentAlias}>
          <input type="radio" bind:group={currentPage} id="typical" value="typical">
          <label for="typical">
            <span>Typical</span>
          </label>
          <input type="radio" bind:group={currentPage} id="circles" value="circles">
          <label for="circles">
            <span>Circles</span>
          </label>
          <input type="radio" bind:group={currentPage} id="conditionals" value="conditionals">
          <label for="conditionals">
            <span>Conditionals</span>
          </label>
          <input type="radio" bind:group={currentPage} id="events" value="events">
          <label for="events">
            <span>Events</span>
          </label>
        </form>
      </div>
      <div class="pages-container--pages">
        <Typical isThisPage={currentPage}/>
        <Circles isThisPage={currentPage}/>
        <Conditionals isThisPage={currentPage}/>
        <Events isThisPage={currentPage} on:emitSomeEvent={catchSomeEvent}/>
      </div>

    </div>
  </main>
  <Footer/>
</div>


<!--{#each customers as person, i (i)}-->
<!--  <b>{i + 1}</b>-->
<!--  <Personal firstName={person}/>-->
<!--{/each}-->

<style lang="scss">
  main {
    padding: 1em;
    margin: 0 auto;
    box-shadow: 0 0 1px rgba(0,0,0,0.6);
    border-radius: 3px;
  }
  .main-block {
    min-height: calc(100vh - 260px);
    margin: 0 auto;
  }

  :global(h1) {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 100;
  }
  :global(.main-heading) {
    color: #999999;
  }

  :global(input) {
    outline: none;
    border: none;
    background-color: #dedede;
    border-radius: 6px;
  }
  :global(.action-btn) {
    border: none;
    background-color: #444;
    border-radius: 6px;
    padding: 6px;
    font-size: 14px;
    cursor: pointer;
    color: #fff;
    &:hover {
      background-color: lighten(#444, 20%)
    }
  }

  input {
    &:global(.invalid) {
      border: 1px solid red;
    }
    :global(.valid) {
      border: 1px solid green;
    }
  }
  .pages-container {
    &--controls {
      input {
        display: none;        
        vertical-align: middle;
        
      }
      input:checked + label {
        &:before {
          background-color: #ddd;
          box-shadow: inset 0 0 0 1px #fff;
        }
      }
      label {
        display: inline-block;
        margin-right: 10px;
        &:before {
          content: '';
          display: inline-block;
          border: 1px solid #ddd;
          width: 14px;
          height: 14px;
          border-radius: 40%;
          margin-right: 8px;
          vertical-align: middle;
        }

      }
    }
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
