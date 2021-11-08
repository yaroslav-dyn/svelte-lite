<header class="header main-column">
  <div class="logo">
    <img src="../../../img/logo.svg" alt="logo" />
  </div>
  <div class="api_status__container">
    <div class={apiStatus && apiStatus.status > 300 ? 'api_status error' : 'api_status success'}>
      <strong>API status: </strong>
      <span>{apiStatus && apiStatus.status} {apiStatus && apiStatus.statusText}</span>
    </div>
  </div>
</header>

<script>
  export let apiStatus = null
</script>
<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    max-width: 80px;
    height: auto;
  }
  .logo > img {
    width: 100%;
    height: auto;
    display: inline-block;
  }
  .api_status {
    font-size: 12px;
    font-weight: 100;
    background-color: #f8f8f8;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
    display: inline-block;
    padding: 8px 14px;
    border-radius: 8px;
  }
  .api_status__container {
    display: flex;
    justify-content: flex-end;
  }

  .api_status.error {
    color: darkred;
  }

  .api_status.success {
    color: green;
  }
</style>
