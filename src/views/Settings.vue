<template>
  <div class="container page" style="overflow-x: hidden !important;">
    <h2>Profile settings</h2>
    <hr />
    <div class="row">
      <div class="col-md-9 mx-auto">
        <div class="mb-4" v-if="!state.isConfirmed">
          <el-alert
            title="Email confirmation"
            type="warning"
            description="You've not confirmed your e-mail yet. You should do it as soon as possible to get access to all the features."
            show-icon
            :closable="false"
          />
          <router-link to="/confirm-email">
            <el-button type="warning" size="small" round class="mt-2 ml-2">Confirm e-mail </el-button>
          </router-link>
        </div>
        <changeName />
        <hr class="divider" />
        <changePassword />
        <hr class="divider" />
        <div class="d-flex justify-content-between">
          <div class="w-50">
            <h4 style="margin-left: -2rem" class="mb-3">Logout</h4>
            <el-button type="danger" round size="small" @click="logout()">Logout</el-button>
            <el-button type="danger" round size="small" @click="logoutAll()">Logout from all devices</el-button>
          </div>
          <div class="w-50">
            <h4 class="mb-3">Delete account</h4>
            <el-button type="danger" round size="small" style="margin-left: 2rem" @click="deleteAccount()">Delete</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import changeName from '@/components/User/changeName.vue';
import changePassword from '@/components/User/changePassword.vue';
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  components: { changeName, changePassword },

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const state = reactive({
      isConfirmed: computed(() => store.getters['User/GET_CONFIRMED'])
    });

    function logout() {
      let sure = confirm('Are you sure to logout?');
      if (sure) store.dispatch('User/LOG_OUT');
      router.push('/');
    }

    function logoutAll() {
      let sure = confirm('Are you sure to logout from all devices?');
      if (sure) store.dispatch('User/LOG_OUT_ALL');
      router.push('/');
    }

    async function deleteAccount() {
      let sure = confirm("Are you sure to delete your account? You wouldn't be able to restore it later!");

      if (sure) {
        const response = await fetch(store.getters['User/GET_URL'] + '/me', {
          method: 'DELETE',
          headers: { Authorization: localStorage.getItem(store.getters['User/GET_JWT']) }
        });
        if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
        const message = await response.text();

        store.dispatch('User/SET_SIGNED_IN', false);
        store.dispatch('User/SET_CONFIRMED', false);
        toast.success(message);
        router.push('/');
      }
    }

    return { state, logout, logoutAll, deleteAccount };
  }
};
</script>

<style lang="scss" scoped>
.divider {
  width: 120%;
  margin: 1.4rem 0 1.8rem -10%;
}
</style>
