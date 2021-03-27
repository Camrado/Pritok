<template>
  <div>
    <span class="send-again" @click="state.showModal = true">specify another e-mail</span>

    <div class="modal-mask text-left" v-if="state.showModal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header align-items-center">
            <h4 class="modal-title mb-0">Change e-mail</h4>
            <i class="el-icon-close" style="cursor: pointer;" @click="state.showModal = false" />
          </div>
          <div class="modal-body text-center">
            <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top" class="text-left mt-3">
              <el-form-item label="New e-mail" prop="email">
                <el-input v-model="state.form.email" clearable />
              </el-form-item>
              <el-form-item class="text-right">
                <el-button type="primary" @click="submitForm()" :loading="state.loadingBtn">Submit</el-button>
                <el-button @click="state.showModal = false">Cancel</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmailValid, emailValidator } from '@/assets/js/userValidators.js';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';

export default {
  name: 'changeEmail',

  setup() {
    const store = useStore();
    const toast = useToast();

    const state = reactive({
      showModal: false,
      form: { email: '' },
      formRules: { email: [{ validator: emailValidator, trigger: 'blur' }] },
      loadingBtn: false
    });

    function submitForm() {
      if (isEmailValid) {
        changeEmail();
      } else {
        toast.warning('Fill the e-mail field correctly!');
      }
    }

    async function changeEmail() {
      state.loadingBtn = true;

      const response = await fetch(store.getters['User/GET_URL'] + '/me/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        },
        body: JSON.stringify(state.form)
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const data = await response.json();

      state.loadingBtn = false;
      if (data.error) return toast.error(data.error);
      toast.success(data.success);
      store.dispatch('User/SET_EMAIL', state.form.email);

      state.showModal = false;
    }

    return { state, submitForm };
  }
};
</script>

<style lang="scss" scoped></style>
