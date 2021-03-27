<template>
  <div>
    <h4 style="margin-left: -2rem">Change name</h4>
    <el-form :model="state.form" status-icon :rules="state.formRules" label-position="top">
      <el-form-item label="Name" prop="name" class="mb-3">
        <el-input v-model="state.form.name" clearable />
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
import { isSettingsNameValid, nameValidator } from '@/assets/js/userValidators.js';
import { onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';

export default {
  name: 'changeName',

  setup() {
    const store = useStore();
    const toast = useToast();

    onMounted(() => {
      state.form.name = store.getters['User/GET_NAME'];
    });

    const state = reactive({
      form: { name: '' },
      formRules: { name: [{ validator: nameValidator, trigger: 'blur' }] },
      loadingBtn: false
    });

    function submitForm() {
      if (isSettingsNameValid) changeName();
      else toast.warning('Fill the name field correctly!');
    }

    async function changeName() {
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
      const message = await response.json();

      store.dispatch('User/SET_NAME', state.form.name);
      state.loadingBtn = false;
      toast.success(message.success);
    }

    return { state, submitForm };
  }
};
</script>

<style lang="scss" scoped></style>
