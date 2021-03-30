<template>
  <div class="row">
    <div class="col-md-7">
      <div class="content">
        <div class="content__header">
          <img src="../assets/img/logo.svg" alt="Logo image" class="logo" />
          <h4>Welcome,</h4>
          <p>It only takes <span>a few seconds</span> to create your account</p>
        </div>
        <div class="content__body">
          <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
            <el-form-item label="Name" prop="name">
              <el-input v-model="state.form.name" placeholder="Your name" clearable />
            </el-form-item>
            <el-form-item class="my-3" label="Email" prop="email">
              <el-input v-model="state.form.email" placeholder="Email address" clearable />
            </el-form-item>
            <el-form-item class="my-3" label="Password" prop="password">
              <el-input v-model="state.form.password" show-password placeholder="Password" clearable />
            </el-form-item>
            <el-form-item class="my-3" label="Confirm password" prop="confirmPassword">
              <el-input v-model="state.form.confirmPassword" show-password placeholder="Confirm your password" clearable />
            </el-form-item>
          </el-form>
        </div>
        <div class="content__footer">
          <p>Already have an account? <router-link to="/signin">Sign in</router-link></p>
          <el-button type="primary" @click="submitForm()" :loading="state.loadingBtn" id="sign-button">Sign Up</el-button>
        </div>
      </div>
    </div>
    <div class="col-md-5 d-none d-md-block">
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
  </div>
</template>

<script>
import {
  isNameValid,
  nameValidator,
  isEmailValid,
  emailValidator,
  isPasswordValid,
  passwordValidator
} from '@/assets/js/userValidators.js';
import { onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'SignUp',

  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const state = reactive({
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      formRules: {
        name: [{ validator: nameValidator, trigger: 'blur' }],
        email: [{ validator: emailValidator, trigger: 'blur' }],
        password: [{ validator: passwordValidator, trigger: 'blur' }],
        confirmPassword: [{ validator: passwordValidator, trigger: 'blur' }]
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
      if (isNameValid && isEmailValid && isPasswordValid && state.form.password === state.form.confirmPassword) {
        SignUp();
      } else if (state.form.password !== state.form.confirmPassword) {
        toast.warning('Password and Confirm Password fields are not equal!');
      } else {
        toast.warning('Fill all the fields correctly!');
      }
    }

    async function SignUp() {
      state.loadingBtn = true;

      let body = { ...state.form };
      delete body.confirmPassword;

      const response = await fetch(store.getters['User/GET_URL'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const data = await response.json();

      if (data.error) {
        state.loadingBtn = false;
        return toast.error(data.error);
      }

      store.dispatch('User/SET_SIGNED_IN', true);
      store.dispatch('User/SET_CONFIRMED', data.user.isVerified);
      store.dispatch('User/SET_EMAIL', data.user.email);
      store.dispatch('User/SET_NAME', data.user.name);
      localStorage.setItem(store.getters['User/GET_JWT'], data.token);
      store.dispatch('Purchases/SET_SHOW_CONTENT', false);
      state.loadingBtn = false;
      toast.success("You've successfully signed in!");

      router.push('/confirm-email');
    }

    return { state, submitForm };
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/signup.scss';
</style>
