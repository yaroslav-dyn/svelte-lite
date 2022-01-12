<main class="main_area main-column">


    <section class="section_item">


      {#if currentLetter}
        <label class="group_header">{currentLetter.group}</label>
        <div>
            <textarea
                class="idea_letter custom-input area"
                name="idea"
                bind:value={currentLetter.text} />
        </div>

      {/if}

      <ul class="group_motion">
      {#each Letters as letter }
        <li class="group_motion__item" on:click={()=>setCategory(letter)}>
          <span class="group_motion__label"> {letter.group.substring(0,2)} </span>
        </li>
      {/each}
      </ul>
    </section>

</main>

<script lang="ts">
  let Letters = [
    {
      text: 'Hi! My name is Mark',
      group: 'personal',
      icon: 'person'
    },
    {
      text: 'My goals',
      group: 'business',
      icon: 'business'
    }
  ];
  let currentLetter = {
    text: 'Hi! My name is Mark',
    group: 'personal',
    icon: 'person'
  };
  let currentGroup = 'personal';


  const setCategory = (letter) => {
    currentLetter = letter;
    console.log(currentLetter);
  }

</script>

<style lang="scss">
  .main_area {
    padding: 1rem;
  }
  .group_header {
    display: inline-block;
    font-size: 16px;
    padding: 1rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  .idea_letter {
    width: 100%;
    height: 70vh;
    border: none;
    &:focus {
      outline: none;
      box-shadow: 0 0 1px rgba(0,0,0,0.6);
    }
  }

  .group_motion {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    list-style: none;
    padding: 0;
    &__item {
      border: 2px solid #1091cb;
      border-radius: 6px;
      padding: 8px;
      margin-right: 0.5rem;
    }
    &__label {
      text-transform: uppercase;
    }
  }

</style>
