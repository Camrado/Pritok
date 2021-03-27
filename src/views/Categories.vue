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
        <el-select v-model.number="state.pageSize" style="width: 72px;">
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

export default {
  name: 'Categories',
  components: { CategoriesTable, InsertBtn },

  setup() {
    const store = useStore();

    const state = reactive({
      search: '',
      pageSize: store.getters['Categories/GET_PAGE_SIZE'],
      loading: false,
      showContent: false,
      showErrorMessage: false
    });

    onMounted(async () => {
      try {
        state.loading = true;
        await store.dispatch('Categories/SET_SEARCH', '');
        await store.dispatch('Categories/SELECT_DATA');
        state.showContent = true;
        state.loading = false;
      } catch {
        state.showContent = false;
        state.showErrorMessage = true;
        state.loading = false;
      }
    });

    async function setSearchAndReload() {
      state.loading = true;
      await store.dispatch('Categories/SET_SKIP', 0);
      await store.dispatch('Categories/SET_SEARCH', state.search);
      await store.dispatch('Categories/SELECT_DATA');
      await store.dispatch('Categories/SET_CURRENT_PAGE', 1);
      state.loading = false;
    }

    // Watch for state.pageSize and dispatch if needed
    watch(
      () => state.pageSize,
      (newPageSize) => {
        state.loading = true;
        store.dispatch('Categories/SET_PAGE_SIZE', +newPageSize);
        store.dispatch('Categories/SELECT_DATA');
        state.loading = false;
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
