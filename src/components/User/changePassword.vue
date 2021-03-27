<template>
  <div>
    <h4 style="margin-left: -2rem">Change password</h4>
    <el-form :model="state.form" :rules="state.formRules" label-position="top">
      <el-form-item label="Current password" prop="currentPassword">
        <el-input v-model="state.form.currentPassword" clearable show-password />
      </el-form-item>
      <el-form-item label="New password" prop="newPassword">
        <el-input v-model="state.form.newPassword" clearable show-password />
      </el-form-item>
      <el-form-item label="Confirm new password" prop="confirmNewPassword" class="mb-3">
        <el-input v-model="state.form.confirmNewPassword" clearable show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" :loading="state.loadingBtn" round size="small" class="ml-2">
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  isPasswordValid,
  passwordValidator,
  isNewPasswordValid,
  newPasswordValidator,
  isConfirmNewPasswordValid,
  confirmNewPasswordValidator
} from '@/assets/js/userValidators.js';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';

export default {
  name: 'changePassword',

  setup() {
    const store = useStore();
    const toast = useToast();

    const state = reactive({
      form: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      formRules: {
        currentPassword: [{ validator: passwordValidator, trigger: 'blur' }],
        newPassword: [{ validator: newPasswordValidator, trigger: 'blur' }],
        confirmNewPassword: [{ validator: confirmNewPasswordValidator, trigger: 'blur' }]
      },
      loadingBtn: false
    });

    function submitForm() {
      if (
        isPasswordValid &&
        isNewPasswordValid &&
        isConfirmNewPasswordValid &&
        state.form.newPassword === state.form.confirmNewPassword
      ) {
        changePassword();
      } else if (state.form.newPassword !== state.form.confirmNewPassword) {
        toast.error('New Password and Confirm New Password fields must be equal!');
      } else {
        toast.warning('Fill all the field correctly!');
      }
    }

    async function changePassword() {
      state.loadingBtn = true;

      const body = { ...state.form };
      delete body.confirmNewPassword;

      const response = await fetch(store.getters['User/GET_URL'] + '/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        },
        body: JSON.stringify(body)
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const message = await response.json();

      state.loadingBtn = false;
      if (message.error) toast.error(message.error);
      else if (message.success) {
        toast.success(message.success);
        state.form = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
      }
    }

    return { state, submitForm };
  }
};
</script>

<style lang="scss" scoped></style>
