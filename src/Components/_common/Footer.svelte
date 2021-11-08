<script>
</script>


<footer class="footer main-column">
  <nav class="footer_nav">
    <a href="/" class="footer_nav__link">
      <span class="material-icons footer_nav__icon">notes</span>
    </a>
    <a class="footer_nav__link">
      <span class="material-icons footer_nav__icon">note_alt</span>
    </a>
    <a href="/settings" class="footer_nav__link">
      <span class="material-icons footer_nav__icon">settings</span>
    </a>
  </nav>
</footer>


<style lang="scss">
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &_nav {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      &__link {
        display: inline-block;
        margin-right: 10px;
      }
      &__icon {
        font-size: 2.8rem;
      }
    }
  }
</style>
