<template>
  <div>
    <el-button type="success" @click="state.showModal = true" icon="el-icon-plus">Add purchase</el-button>

    <div class="modal-mask text-left" v-if="state.showModal">
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
              <el-form-item label="Date" prop="date">
                <el-date-picker type="date" v-model="state.form.date" class="w-100" />
              </el-form-item>
              <el-form-item class="my-3" label="Category" prop="category">
                <el-select v-model="state.form.category" placeholder="Select a category" class="w-100 addPadding">
                  <el-option v-for="category in state.categories" :key="category._id" :value="category.name" class="pl-3">
                    {{ category.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="my-3" label="Product" prop="item">
                <el-input v-model="state.form.item" placeholder="Product name" class="addPadding" />
              </el-form-item>
              <el-form-item class="my-3" label="Price" prop="price">
                <el-input-number v-model="state.form.price" :precision="2" :step="0.1" :min="0.01" class="w-100" />
              </el-form-item>
              <el-form-item class="my-3" label="Quantity" prop="quantity">
                <el-input-number v-model="state.form.quantity" :precision="0" :step="1" :min="1" class="w-100" />
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
import { isItemValid, itemValidator, isDateValid, dateValidator } from '@/assets/js/purchaseValidators.js';
import { computed, reactive } from 'vue';
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
        date: new Date().toJSON().slice(0, 10),
        category: '',
        item: '',
        price: 0.01,
        quantity: 1,
        total_price: 0
      },
      formRules: {
        date: [{ validator: dateValidator, trigger: 'blur' }],
        item: [{ validator: itemValidator, trigger: 'blur' }]
      },
      loadingBtn: false,
      categories: computed(() => store.getters['Categories/GET_CONTENT_FOR_PURCHASES'])
    });

    // 'Submit form' button checking if everything is valid
    function submitForm() {
      if (isDateValid && state.form.category && isItemValid && state.form.price && state.form.quantity) {
        insertPurchase();
      } else {
        toast.error('Fill all the fields correctly!');
      }
    }

    // fetch function to add purchase and show toast notification
    async function insertPurchase() {
      state.loadingBtn = true;

      if (typeof state.form.date !== 'string') {
        state.form.date.setDate(state.form.date.getDate() + 1);
        state.form.date = state.form.date.toISOString().slice(0, 10);
      }

      const response = await fetch(store.getters['Purchases/GET_URL'], {
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

      state.loadingBtn = false;
      store.dispatch('Purchases/SELECT_DATA');
      state.showModal = false;
      ClearForm();
    }

    // Function for clearing form after submit or cancel
    function ClearForm() {
      state.form = {
        date: new Date().toJSON().slice(0, 10),
        category: '',
        item: '',
        price: 0.01,
        quantity: 1,
        total_price: 0
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

<style lang="scss" scoped></style>
