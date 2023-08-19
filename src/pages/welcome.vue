<script setup>

</script>

<template>
  <f7-page name="welcome" class="welcome-container">
    <div class="welcome-image">
      <img class="welcome-illustration" src="assets/marketplace-illustration.svg" alt="...">
    </div>
    <div class="welcome-content">
      <div class="welcome-info">
        <div class="welcome-logo">
          <img src="assets/swapifine-logo.png" alt="...">
          <h1>Swapi<span>fine</span></h1>
          <p>A future marketplace experience that is seamless, sophisticated, and caters to both swapping and selling.</p>
        </div>
        <div class="welcome-buttons">
          <a href="/login/"><button class="primary-button">Login</button></a>
          <a href="/signup/"><button class="secondary-button">Sign up</button></a>
        </div>
        <div class="welcome-version">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  </f7-page>
</template>

<style lang="scss">
.welcome-container {
  position: relative;
  overflow: hidden;
  background: #EBEBEB;

  .welcome-image {
    background-color: #003D66;
    display: flex;
    justify-content: center;
    height: 40%;
    z-index: 1;

    .welcome-illustration {
      height: 100%;
      width: 100%;
      padding-bottom: 20px;
    }
  }

  .welcome-content {
    background: #EBEBEB;
    height: 60%;
    z-index: 2;
    border-top-left-radius: 15% 20px;
    border-top-right-radius: 15% 20px;
    margin-top: -20px;
    padding: 18px;

    .welcome-info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 30px;

      .welcome-logo{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 28px;

        img{
          width: 78px;
        }
        h1{
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          color: #003D66;

          span{
            font-weight: 200;
          }
        }
        p{
          font-size: 16px;
          width: 70%;
          text-align: center;
          font-weight: 300;

          @media only screen and (max-width: 990px) {
            width: 100%;
        }
        }
      }
      .welcome-buttons{
        width: 20%;
        display: flex;
        flex-direction: column;
        gap: 12px;

        @media only screen and (max-width: 990px) {
            width: 100%;
        }
      }
      .welcome-version{
        font-size: 12px;
        margin-top: 24px;
      }
    }
  }
}
</style>
