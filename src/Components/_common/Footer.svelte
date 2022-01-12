<script>
  import NavLink from '../_common/atoms/NavLink.svelte';
</script>


<footer class="footer main-column">
  <nav class="footer_nav">
    <NavLink
        refUrl="/"
        linkClass="footer_nav__link"
        iconClass="footer_nav__icon"
        iconSymbol="notes">
    </NavLink>

    <NavLink
        refUrl="/idea"
        linkClass="footer_nav__link"
        iconClass="footer_nav__icon"
        iconSymbol="note_alt">
    </NavLink>

    <NavLink
        refUrl="/settings"
        linkClass="footer_nav__link"
        iconClass="footer_nav__icon"
        iconSymbol="settings">
    </NavLink>
  </nav>
</footer>


<style lang="scss">
  :global {
    .footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      &_nav {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex: 1;
        &__link {
          display: inline-block;
          margin-right: 10px;
          padding: 2px;
          &.active {
            border: 2px solid;
            border-radius: 6px;
          }
        }
        &__icon {
          font-size: 2.8rem;
        }
      }
    }
  }

</style>
