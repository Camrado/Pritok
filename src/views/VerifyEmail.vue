<template>
  <div class="container page">
    <div class="row">
      <div class="col-md-6">
        <el-card class="text-center">
          <template #header>
            <div class="card-header">Pritok - Email Confirmation</div>
          </template>
          <img src="../assets/img/icons/email-confirmation.svg" alt="Email Confirmation Image" class="email-confirmation-image" />
          <p class="mt-3"><strong>Check Your Inbox</strong></p>
          <p>We have sent a confirmation code to your e-mail</p>
          <p>{{ state.email }}</p>
          <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top" class="text-left mt-3">
            <el-form-item label="Code from the e-mail" prop="code">
              <el-input v-model="state.form.code" maxlength="6" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="w-100 mt-4" @click="submitForm()" :loading="state.loadingBtn">Continue</el-button>
            </el-form-item>
          </el-form>
          <small>
            If you haven't received anything, you can <span class="send-again" @click="sendAgain()">send again</span> or
            <changeEmail />
          </small>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { isCodeValid, codeValidator } from '@/assets/js/userValidators.js';
import changeEmail from '@/components/User/changeEmail.vue';
import { computed, onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'VerifyEmail',
  components: { changeEmail },

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const state = reactive({
      email: computed(() => store.getters['User/GET_EMAIL']),
      form: { code: '' },
      formRules: { code: [{ validator: codeValidator, trigger: 'blur' }] },
      loadingBtn: false
    });

    onMounted(() => {
      getEmail();
    });

    function submitForm() {
      if (isCodeValid) {
        confirmAccount();
      } else {
        toast.warning('Fill the code field correctly!');
      }
    }

    // confirms account by the code user has typed
    async function confirmAccount() {
      state.loadingBtn = true;

      const response = await fetch(store.getters['User/GET_URL'] + '/me/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        },
        body: JSON.stringify({ verificationKey: state.form.code })
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const data = await response.json();

      state.loadingBtn = false;
      if (data.error) return toast.error(data.error);
      toast.success(data.success);
      store.dispatch('User/SET_CONFIRMED', true);
      store.dispatch('Purchases/SET_SHOW_CONTENT', false);

      router.push('/categories');
    }

    // returns user's email by the jwt in localstorage
    async function getEmail() {
      const response = await fetch(store.getters['User/GET_URL'] + '/me', {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        }
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const data = await response.json();

      store.dispatch('User/SET_EMAIL', data.email);
    }

    // Send confirmation email again
    function sendAgain() {
      store.dispatch('User/SEND_EMAIL_CONFIRMATION');
    }

    return { state, submitForm, sendAgain };
  }
};
</script>

<style lang="scss" scoped>
.col-md-6 {
  margin: 10px auto;
}

.card-header {
  text-align: center;
  padding: 5px 10px;
  color: rgb(48, 48, 48);
  font-size: 21px;
}

.email-confirmation-image {
  width: 100px;
}
</style>
