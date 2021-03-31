<template>
  <div class="container page">
    <div class="row align-items-center">
      <!-- Search bar -->
      <div class="col-5">
        <el-input
          placeholder="Search"
          v-model="state.search"
          v-on:keyup.esc="state.search = ''"
          v-on:keyup.enter="setSearchAndReload()"
          clearable
        >
          <template #append>
            <el-button icon="el-icon-search" @click="setSearchAndReload()" />
          </template>
        </el-input>
      </div>
      <!-- Show n categories per page -->
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
        <span> categories</span>
      </div>
      <!-- Add category button -->
      <div class="col-2 text-right">
        <insertBtn />
      </div>
    </div>
    <!-- CategoriesTable itself -->
    <div class="row my-3" v-loading="state.loading">
      <div class="col">
        <CategoriesTable :pageSize="state.pageSize" v-if="state.showContent" />
        <h4 class="text-center text-danger mt-4" v-if="state.showErrorMessage === true">
          Something went wrong
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import CategoriesTable from '@/components/Categories/CategoriesTable.vue';
import InsertBtn from '@/components/Categories/insertBtn.vue';
import { useStore } from 'vuex';
import { onMounted, reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  name: 'Categories',
  components: { CategoriesTable, InsertBtn },

  setup() {
    const store = useStore();
    const toast = useToast();
    const router = useRouter();

    const state = reactive({
      search: '',
      pageSize: store.getters['Categories/GET_PAGE_SIZE'],
      loading: false,
      showContent: false,
      showErrorMessage: false,
      clicks: {
        allowSearchClick: false,
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

      try {
        state.loading = true;
        await store.dispatch('Categories/SET_SEARCH', '');
        await store.dispatch('Categories/SELECT_DATA');
        state.showContent = true;
        // state.loading = false;
        // state.allowClick = true;
      } catch {
        state.showContent = false;
        state.showErrorMessage = true;
        // state.loading = false;
        // state.allowClick = true;
      } finally {
        state.loading = false;
        state.allowClick = true;
      }
    });

    async function setSearchAndReload() {
      if (!state.allowClick) return false;
      if (!state.clicks.allowSearchClick) return false;
      state.allowClick = false;
      state.clicks.allowSearchClick = false;

      state.loading = true;
      await store.dispatch('Categories/SET_SKIP', 0);
      await store.dispatch('Categories/SET_SEARCH', state.search);
      await store.dispatch('Categories/SELECT_DATA');
      await store.dispatch('Categories/SET_CURRENT_PAGE', 1);
      state.loading = false;
      state.allowClick = true;
    }

    // Watch for state.pageSize and dispatch if needed
    watch(
      () => state.pageSize,
      async (newPageSize) => {
        state.allowClick = false;
        state.clicks.allowPageSizeClick = false;
        state.clicks.allowSearchClick = false;
        state.loading = true;
        await store.dispatch('Categories/SET_PAGE_SIZE', +newPageSize);
        await store.dispatch('Categories/SELECT_DATA');
        state.loading = false;

        setTimeout(() => {
          state.clicks.allowPageSizeClick = true;
        }, 1500);
        state.clicks.allowSearchClick = true;
        state.allowClick = true;
      }
    );

    // Watch for state.search and if it changes allow user to click search button
    watch(
      () => state.search,
      () => {
        state.clicks.allowSearchClick = true;
      }
    );

    return {
      state,
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
