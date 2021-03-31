<template>
  <div class="container page">
    <!-- Form to show purchases from n date to n date -->
    <div class="row align-items-center">
      <div class="col">
        <div class="form-group d-flex align-items-center justify-content-center">
          <p class="m-0">Show purchases from</p>
          <el-date-picker v-model="state.fromDate" type="date" placeholder="Pick a day" class="mx-3" />
          <p class="m-0">to</p>
          <el-date-picker v-model="state.toDate" type="date" placeholder="Pick a day" class="mx-3" />
          <el-button type="primary" @click="setDateAndReload()">Submit</el-button>
        </div>
      </div>
    </div>
    <div class="row align-items-center mt-3" v-if="state.showContent === true">
      <!-- Search bar -->
      <div class="col-5">
        <el-input placeholder="Search" v-model="state.search" v-on:keyup.esc="state.search = ''" clearable>
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="setSearchAndReload()"
              :disabled="!(state.clicks.allowSearchClick && state.allowClick)"
            />
          </template>
        </el-input>
      </div>
      <!-- Show n purchases per page -->
      <div class="col text-right">
        <span>Show </span>
        <el-select
          v-model.number="state.pageSize"
          style="width: 72px;"
          :disabled="!(state.clicks.allowPageSizeClick && state.allowClick)"
        >
          <el-option class="pl-3" value="10">10</el-option>
          <el-option class="pl-3" value="25">25</el-option>
          <el-option class="pl-3" value="50">50</el-option>
          <el-option class="pl-3" value="100">100</el-option>
        </el-select>
        <span> purchases</span>
      </div>
      <!-- Add purchase button -->
      <div class="col-2 mr-1">
        <insertBtn />
      </div>
    </div>
    <!-- PurchasesTable itself with loading and error messages -->
    <div class="row my-3" v-loading="state.loading">
      <div class="col">
        <PurchasesTable :pageSize="state.pageSize" v-if="state.showContent === true" />
        <h4 class="text-center text-danger mt-4" v-if="state.showErrorMessage === true">
          Something went wrong
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import PurchasesTable from '@/components/Purchases/PurchasesTable.vue';
import InsertBtn from '@/components/Purchases/insertBtn.vue';
import { useStore } from 'vuex';
import { computed, onMounted, reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  name: 'Purchase',
  components: { PurchasesTable, InsertBtn },

  setup() {
    const store = useStore();
    const toast = useToast();
    const router = useRouter();
    const state = reactive({
      search: '',
      pageSize: store.getters['Purchases/GET_PAGE_SIZE'],
      fromDate: null,
      toDate: null,
      loading: false,
      showErrorMessage: false,
      showContent: computed(() => store.getters['Purchases/GET_SHOW_CONTENT']),
      clicks: {
        allowSearchClick: false,
        allowSubmitClick: true,
        allowPageSizeClick: true
      },
      allowClick: false
    });

    onMounted(async () => {
      if (!store.getters['User/GET_SIGNED_IN']) {
        router.push('/signup');
        return toast.info('You have to sign up before accessing this page');
      } else if (store.getters['User/GET_SIGNED_IN'] && !store.getters['User/GET_CONFIRMED']) {
        router.push('/confirm-email');
        return toast.info('You have to confirm your account before accessing this page');
      }

      if (store.getters['Purchases/GET_FROM_DATE'] && store.getters['Purchases/GET_TO_DATE']) {
        state.fromDate = store.getters['Purchases/GET_FROM_DATE'];
        state.toDate = store.getters['Purchases/GET_TO_DATE'];
      } else {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        state.fromDate = formatDate(firstDay);
        state.toDate = new Date().toJSON().slice(0, 10);
      }

      store.dispatch('Purchases/SET_SEARCH', '');
    });

    // Return String type like 2021-01-01 from Date type
    function formatDate(date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }

    async function setDateAndReload() {
      if (!state.clicks.allowSubmitClick) return false;
      state.allowClick = false;
      state.clicks.allowSubmitClick = false;

      state.loading = true;
      try {
        await store.dispatch('Purchases/SET_SKIP', 0);
        await store.dispatch('Purchases/SET_DATE', { fromDate: state.fromDate, toDate: state.toDate });
        if (!store.getters['Purchases/GET_SHOW_CONTENT']) store.dispatch('Purchases/SET_SHOW_CONTENT', true);
        await store.dispatch('Purchases/SELECT_DATA');
        await store.dispatch('Purchases/SET_CURRENT_PAGE', 1);
      } catch {
        state.showErrorMessage = true;
      } finally {
        state.loading = false;
      }

      state.allowClick = true;
    }

    async function setSearchAndReload() {
      if (!state.allowClick) return false;
      if (!state.clicks.allowSearchClick) return false;
      state.allowClick = false;
      state.clicks.allowSearchClick = false;

      state.loading = true;
      await store.dispatch('Purchases/SET_SKIP', 0);
      await store.dispatch('Purchases/SET_SEARCH', state.search);
      await store.dispatch('Purchases/SELECT_DATA');
      await store.dispatch('Purchases/SET_CURRENT_PAGE', 1);
      state.loading = false;
      state.allowClick = true;
    }

    // Watch for state.pageSize and dispatch if needed
    watch(
      () => state.pageSize,
      async (newPageSize) => {
        state.allowClick = false;
        state.clicks.allowPageSizeClick = false;
        state.loading = true;
        await store.dispatch('Purchases/SET_PAGE_SIZE', +newPageSize);
        await store.dispatch('Purchases/SELECT_DATA');
        state.loading = false;

        setTimeout(() => {
          state.clicks.allowPageSizeClick = true;
          state.allowClick = true;
        }, 1500);
      }
    );

    // Watch for state.search and if it changes allow user to click search button
    watch(
      () => state.search,
      () => {
        state.clicks.allowSearchClick = true;
      }
    );

    // Watch for state.fromDate and state.toDate and if one of them changes allow user to click submit button
    watch(
      () => state.fromDate,
      () => {
        state.clicks.allowSubmitClick = true;
      }
    );
    watch(
      () => state.toDate,
      () => {
        state.clicks.allowSubmitClick = true;
      }
    );

    return {
      state,
      setDateAndReload,
      setSearchAndReload
    };
  }
};
</script>

<style lang="scss" scoped>
.input-group-prepend {
  user-select: none;
}
</style>
