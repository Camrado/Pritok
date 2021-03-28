<template>
  <div class="loader">
    <div class="loader__image"></div>
  </div>
</template>

<script>
export default {
  name: 'Preloader',

  setup() {
    window.addEventListener('load', function() {
      const loader = document.querySelector('.loader');
      loader.className += ' hidden'; //? "loader hidden"
    });
  }
};
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  z-index: 1000000000000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;

  &__image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4rem;
    height: 4rem;
    background-image: url('../assets/img/icons/loading.gif');
    background-size: cover;
    background-repeat: no-repeat;
  }
}

.loader.hidden {
  display: none;
}
</style>
