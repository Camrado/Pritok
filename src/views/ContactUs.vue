<template>
  <div class="container page">
    <header class="header text-center">
      <h2>Contact</h2>
      <hr />
      <p>For all enquiries, please email us using the form below.</p>
    </header>
    <main class="row justify-content-center">
      <div class="col-md-7">
        <div class="first" v-if="state.active === 0">
          <h4 class="mb-2">How can we help you?</h4>
          <el-select v-model="state.form.purpose" placeholder="Select" class="w-100">
            <el-option value="I've found some issue and would like to report it.">
              I've found some issue and would like to report it.
            </el-option>
            <el-option value="I've got some problem and don't know how to solve it.">
              I've got some problem and don't know how to solve it.
            </el-option>
            <el-option value="I've got a cool idea how to improve Pritok.">
              I've got a cool idea how to improve Pritok.
            </el-option>
            <el-option value="Other">
              Other
            </el-option>
          </el-select>

          <el-button type="primary" round @click="firstContinue()" class="mt-3">Continue</el-button>
        </div>

        <div class="second" v-if="(state.isSignedIn && (state.active === 1 || state.active === 2)) || state.active === 1">
          <h4 class="mb-2">Message</h4>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="Please input"
            v-model="state.form.message"
            maxlength="300"
            show-word-limit
          />

          <el-button v-if="!state.isSignedIn" type="primary" round @click="secondContinue()" class="mt-3">Continue</el-button>
          <el-button v-else-if="state.isSignedIn" type="primary" round @click="secondContinueForSigned()" class="mt-3">
            Send message
          </el-button>
        </div>

        <div class="third" v-if="!state.isSignedIn && (state.active === 2 || state.active === 3)">
          <h5 class="mb-2">What's your name?</h5>
          <el-input placeholder="Name" v-model="state.form.name" class="mb-4" />

          <h5 class="my-2">What's your e-mail?</h5>
          <el-input placeholder="E-mail" v-model="state.form.email" class="mb-4" />

          <el-button type="primary" round @click="thirdContinue()" class="mt-3">Send message</el-button>
        </div>
      </div>
    </main>
    <footer class="mt-5">
      <el-steps :active="state.active" align-center>
        <el-step title="Purpose" description="How can we help you?"></el-step>
        <el-step title="Message" description="What is your message to us?"></el-step>
        <el-step v-if="!state.isSignedIn" title="From whom" description="What're your email and name?"></el-step>
      </el-steps>
    </footer>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const toast = useToast();

    const state = reactive({
      active: 0,
      isSignedIn: computed(() => store.getters['User/GET_SIGNED_IN']),
      isEmailSent: false,
      form: {
        purpose: '',
        message: '',
        name: '',
        email: ''
      }
    });

    function firstContinue() {
      if (state.form.purpose) state.active = 1;
      else toast.info('Select one');
    }

    function secondContinue() {
      if (!state.form.message) toast.info('Write your message');
      else if (state.form.message.length < 50) toast.info('Minimum length: 50');
      else state.active = 2;
    }

    function secondContinueForSigned() {
      if (!state.form.message) toast.info('Write your message');
      else if (state.form.message.length < 50) toast.info('Minimum length: 50');
      else {
        state.active = 2;
        sendMessage();
      }
    }

    function thirdContinue() {
      let emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let nameRe = /^[a-zA-Z ]*$/;

      if (emailRe.test(state.form.email) && nameRe.test(state.form.name)) {
        state.active = 3;
        sendMessage();
      } else if (!state.form.name) {
        toast.info('Name field is required');
      } else if (!nameRe.test(state.form.name) && state.form.name) {
        toast.info('Name field is not valid (Only letters and spaces)');
      } else if (!emailRe.test(state.form.email) && state.form.email) {
        toast.info('E-mail is not valid');
      } else if (!state.form.email) {
        toast.info('E-mail field is required');
      }
    }

    async function sendMessage() {
      if (state.isEmailSent) return toast.error("You've already sent e-mail");
      state.isEmailSent = true;

      let body = { ...state.form };
      if (state.isSignedIn) {
        body.name = store.getters['User/GET_NAME'];
        body.email = store.getters['User/GET_EMAIL'];
      }

      const response = await fetch(store.getters['User/GET_URL'] + '/contact-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.status !== 200) return toast.error('Sorry. We have got some server errors.');

      toast.success('Message has been sent. Thank you!');
    }

    return { state, firstContinue, secondContinue, secondContinueForSigned, thirdContinue };
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 4rem;
}
.el-select-dropdown__item {
  padding: 0 15px;
}
</style>
