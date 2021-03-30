<template>
  <div class="row">
    <div class="col-md-4 d-none d-md-block">
      <el-carousel :interval="10000" arrow="always" height="100vh" trigger="click">
        <el-carousel-item class="carousel-1">
          <div class="carousel-body">
            <h3>Magnificent tool</h3>
            <p>Great tool for monitoring costs and browsing all of the made purchases</p>
          </div>
        </el-carousel-item>
        <el-carousel-item class="carousel-2">
          <div class="carousel-body">
            <h3>Easy to use</h3>
            <p>
              Not complex in using. Everything is divided into separate pages which can be accessed by using a user-friendly
              navigation bar
            </p>
          </div>
        </el-carousel-item>
        <el-carousel-item class="carousel-3">
          <div class="carousel-body">
            <h3>A lot of features</h3>
            <p>
              There are really a lot of cool various features, like search bar, filter showing purchases from one date to another
              one, various dashboards and so on.
            </p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="col-md-8">
      <div class="content">
        <div class="content__header">
          <img src="../assets/img/logo.svg" alt="Logo image" class="logo" />
          <p>Welcome back,</p>
          <p>Please sign in to your account.</p>
          <p>No account? <router-link to="/signup">Sign up now</router-link></p>
        </div>
        <el-divider />
        <div class="content__body">
          <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
            <el-form-item class="my-3" label="Email" prop="email">
              <el-input v-model="state.form.email" placeholder="Email address" clearable />
            </el-form-item>
            <el-form-item class="my-3" label="Password" prop="password">
              <el-input v-model="state.form.password" show-password placeholder="Password" clearable />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitForm()" :loading="state.loadingBtn" id="sign-button">Sign In</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmailValid, emailValidator, isPasswordValid, passwordValidator } from '@/assets/js/userValidators.js';
import { onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const state = reactive({
      form: {
        email: '',
        password: ''
      },
      formRules: {
        email: [{ validator: emailValidator, trigger: 'blur' }],
        password: [{ validator: passwordValidator, trigger: 'blur' }]
      },
      loadingBtn: false
    });

    onMounted(() => {
      if (store.getters['User/GET_SIGNED_IN']) {
        toast.info("You're already signed in");
        router.push('/');
      }
    });

    function submitForm() {
      if (isEmailValid && isPasswordValid) {
        SignIn();
      } else {
        toast.warning('Fill all the fields correctly!');
      }
    }

    async function SignIn() {
      state.loadingBtn = true;

      const response = await fetch(store.getters['User/GET_URL'] + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.form)
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const data = await response.json();

      if (response.status === 400) {
        state.loadingBtn = false;
        return toast.error('Password or E-mail is not correct');
      }

      store.dispatch('User/SET_SIGNED_IN', true);
      store.dispatch('User/SET_CONFIRMED', data.user.isVerified);
      store.dispatch('User/SET_EMAIL', data.user.email);
      store.dispatch('User/SET_NAME', data.user.name);
      localStorage.setItem(store.getters['User/GET_JWT'], data.token);
      store.dispatch('Purchases/SET_SHOW_CONTENT', false);

      state.loadingBtn = false;
      toast.success("You've successfully signed in!");
      router.push('/categories');
    }

    return { state, submitForm };
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/signin.scss';
</style>
