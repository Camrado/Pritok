<template>
  <div>
    <i class="custom-icon el-icon-delete" @click="showModal = true"></i>

    <div class="modal-mask text-left" v-if="showModal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header align-items-center">
            <h4 class="modal-title mb-0">Delete Purchase</h4>
            <i class="el-icon-close" style="cursor: pointer;" @click="showModal = false" />
          </div>
          <div class="modal-body text-center">
            <p class="mb-4 mt-2">Are you sure that you want to permanently delete the selected purchase?</p>
            <div class="text-right">
              <el-button type="danger" @click="deletePurchase()" :loading="loadingBtn">Submit</el-button>
              <el-button @click="showModal = false">Cancel</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'deleteBtn',

  props: {
    _id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore();
    const toast = useToast();
    let showModal = ref(false);
    let loadingBtn = ref(false);

    // fetch function to delete purchase and show toast notification
    async function deletePurchase() {
      const YPosition = window.pageYOffset;
      loadingBtn.value = true;

      const response = await fetch(store.getters['Purchases/GET_URL'] + `/${props._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem(store.getters['User/GET_JWT'])
        }
      });

      if (response.status === 200) {
        const message = await response.text();
        toast.success(message);
      } else {
        toast.error('Something went wrong.');
      }

      await store.dispatch('Purchases/SELECT_DATA');
      loadingBtn.value = false;
      showModal.value = false;
      window.scrollTo(0, YPosition);
    }

    return {
      showModal,
      deletePurchase,
      loadingBtn
    };
  }
};
</script>

<style lang="scss" scoped>
.custom-icon {
  font-size: 23px;
  color: rgb(223, 41, 41);
  cursor: pointer;
}
</style>
