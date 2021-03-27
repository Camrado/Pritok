<template>
  <div>
    <i class="custom-icon el-icon-edit" @click="getCategoryAndSetValues()"></i>

    <div class="modal-mask text-left" v-if="state.showModal" id="categories-modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h4 class="modal-title mb-0">Update Category</h4>
            <i class="el-icon-close" style="cursor: pointer;" @click="state.showModal = false" />
          </div>
          <div class="modal-body">
            <el-form :model="state.form" status-icon :rules="state.formRules" label-width="100px" label-position="left">
              <el-form-item class="my-3" label="Category" prop="name">
                <el-input v-model="state.form.name" placeholder="Category name" class="addPadding" />
              </el-form-item>
              <el-form-item class="my-3" label="Description" prop="description">
                <el-input v-model="state.form.description" placeholder="Description" class="addPadding" />
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
import {
  isUpdatedNameValid,
  nameValidator,
  isUpdatedDescriptionValid,
  descriptionValidator
} from '@/assets/js/categoryValidators.js';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'updateBtn',

  props: {
    _id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore();
    const toast = useToast();
    const state = reactive({
      showModal: false,
      form: {
        name: undefined,
        description: undefined
      },
      formRules: {
        name: [{ validator: nameValidator, trigger: 'blur' }],
        description: [{ validator: descriptionValidator, trigger: 'blur' }]
      },
      loadingBtn: false
    });

    // 'Submit form' button checking if everything is valid
    function submitForm() {
      if (isUpdatedNameValid && isUpdatedDescriptionValid) {
        updateCategory();
      } else {
        toast.error('Fill all the fields correctly!');
      }
    }

    // fetch function to get category by id and set returned values to form inputs
    async function getCategoryAndSetValues() {
      const response = await fetch(store.getters['Categories/GET_URL'] + `/${props._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        }
      });

      if (response.status !== 200) toast.error('Something went wrong.');

      const category = await response.json();

      state.form = category;
      delete state.form._id;
      delete state.form.author;

      state.showModal = true;
    }

    // fetch function to update category and show toast notification
    async function updateCategory() {
      const YPosition = window.pageYOffset;
      state.loadingBtn = true;

      const response = await fetch(store.getters['Categories/GET_URL'] + `/${props._id}`, {
        method: 'PUT',
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

      await store.dispatch('Categories/SELECT_DATA');
      state.loadingBtn = false;
      state.showModal = false;
      window.scrollTo(0, YPosition);
    }

    return {
      state,
      submitForm,
      getCategoryAndSetValues
    };
  }
};
</script>

<style lang="scss" scoped>
.custom-icon {
  font-size: 23px;
  color: #5cb6ff;
  cursor: pointer;
}
</style>
