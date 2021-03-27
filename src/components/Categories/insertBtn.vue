<template>
  <div>
    <el-button type="success" @click="state.showModal = true" icon="el-icon-plus">Add Category</el-button>

    <div class="modal-mask text-left" v-if="state.showModal" id="categories-modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h4 class="modal-title mb-0">Add Purchase</h4>
            <i
              class="el-icon-close"
              style="cursor: pointer;"
              @click="
                state.showModal = false;
                ClearForm();
              "
            />
          </div>
          <div class="modal-body">
            <el-form :model="state.form" status-icon :rules="state.formRules" label-width="100px" label-position="left">
              <el-form-item class="my-3" label="Category" prop="name">
                <el-input v-model="state.form.name" placeholder="Category name" />
              </el-form-item>
              <el-form-item class="my-3" label="Description" prop="description">
                <el-input v-model="state.form.description" placeholder="Description" />
              </el-form-item>
              <el-form-item class="text-right">
                <el-button type="primary" @click="submitForm()" :loading="state.loadingBtn">Submit</el-button>
                <el-button
                  @click="
                    state.showModal = false;
                    ClearForm();
                  "
                  >Cancel</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNameValid, nameValidator, isDescriptionValid, descriptionValidator } from '@/assets/js/categoryValidators.js';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'insertBtn',

  setup() {
    const store = useStore();
    const toast = useToast();

    const state = reactive({
      showModal: false,
      form: {
        name: '',
        description: ''
      },
      formRules: {
        name: [{ validator: nameValidator, trigger: 'blur' }],
        description: [{ validator: descriptionValidator, trigger: 'blur' }]
      },
      loadingBtn: false
    });

    // 'Submit form' button checking if everything is valid
    function submitForm() {
      if (isNameValid && isDescriptionValid) {
        insertCategory();
      } else {
        toast.error('Fill all the fields correctly!');
      }
    }

    // fetch function to add category and show toast notification
    async function insertCategory() {
      state.loadingBtn = true;

      const response = await fetch(store.getters['Categories/GET_URL'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        },
        body: JSON.stringify(state.form)
      });

      if (response.status === 200) {
        const message = await response.text();
        toast.success(message);
      } else {
        toast.error('Something went wrong.');
      }
      store.dispatch('Categories/SELECT_DATA');
      state.loadingBtn = false;
      state.showModal = false;
      ClearForm();
    }

    // Function for clearing form after submit
    function ClearForm() {
      state.form = {
        name: '',
        description: ''
      };
    }

    return {
      state,
      ClearForm,
      submitForm
    };
  }
};
</script>

<style lang="scss" scoped>
label {
  font-size: 17px;
}
.form-text {
  font-size: 14px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
