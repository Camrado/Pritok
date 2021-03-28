<template>
  <div>
    <!-- <Preloader /> -->

    <div v-if="route.name !== 'SignIn' && route.name !== 'SignUp' && route.name !== 'NotFound'">
      <NavBar />

      <div class="container app-container" :style="state.appContainer">
        <router-view style="margin-top: 5rem; margin-bottom: 50px" v-slot="{ Component }">
          <transition
            enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutLeft"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
// import Preloader from '@/components/Preloader.vue';

export default {
  components: { NavBar /*, Preloader*/ },

  setup() {
    const store = useStore();
    const route = useRoute();
    const toast = useToast();

    const state = reactive({
      appContainer: {
        'padding-left': computed(() => {
          if (store.getters['GET_IS_NAV_OPEN']) return '15rem';
          return '0';
        })
      }
    });

    onMounted(async () => {
      if (!localStorage.getItem(store.getters['User/GET_JWT'])) return;

      const response = await fetch(store.getters['User/GET_URL'] + '/me', {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        }
      });
      if (response.status === 406) return localStorage.removeItem(store.getters['User/GET_JWT']);
      if (response.status !== 200) return toast.error('Something went wrong...');

      const user = await response.json();

      await store.dispatch('User/SET_SIGNED_IN', true);
      await store.dispatch('User/SET_CONFIRMED', user.isVerified);
      await store.dispatch('User/SET_EMAIL', user.email);
      await store.dispatch('User/SET_NAME', user.name);
    });

    return { state, route };
  }
};
</script>

<style lang="scss">
.app-container {
  transition: 0.3s;
}
</style>
