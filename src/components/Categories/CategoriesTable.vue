<template>
  <div>
    <el-table :data="content" :default-sort="{ prop: 'name', order: 'ascending' }" style="width: 100%" v-loading="state.loading">
      <el-table-column prop="name" label="Name" width="280" />
      <el-table-column prop="description" label="Description" />
      <el-table-column lable="Operations" width="45">
        <template #default="scope">
          <updateBtn :_id="scope.row._id" />
        </template>
      </el-table-column>
      <el-table-column lable="Operations" width="45">
        <template #default="scope">
          <deleteBtn :_id="scope.row._id" />
        </template>
      </el-table-column>
    </el-table>

    <!-- FOOTER -->
    <nav v-if="state.pageNum.length !== 1 && content.length !== 0" class="mt-2 d-flex justify-content-between align-items-center">
      <!-- SHOWING 1 TO 10 OF 14 CATEGORIES -->
      <p>
        Showing {{ (state.currentPage - 1) * pageSize + 1 }} to
        <span>{{ state.currentPage * pageSize }}</span>
        of
        {{ state.pageNum.length * pageSize }} categories
      </p>

      <!-- PAGINATION -->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :page-size="pageSize"
        :current-page="state.currentPage"
        :total="state.pageNum.length * pageSize"
      />
    </nav>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import updateBtn from '@/components/Categories/updateBtn.vue';
import deleteBtn from '@/components/Categories/deleteBtn.vue';

export default {
  name: 'CategoriesTable',
  components: { updateBtn, deleteBtn },

  props: {
    pageSize: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const store = useStore();
    const content = computed(() => store.getters['Categories/GET_CONTENT']);

    const state = reactive({
      pageNum: computed(() => {
        let num = store.getters['Categories/GET_PAGE_NUM'],
          arr = [];
        for (let i = 1; i <= num; i++) {
          arr.push(i);
        }
        return arr; // returns array of nums. E.g. if num = 4 it will return [1, 2, 3, 4]
      }),
      currentPage: computed(() => store.getters['Categories/GET_CURRENT_PAGE']),
      loading: false
    });

    // For el-pagination.
    async function changePage(num) {
      state.loading = true;
      await store.dispatch('Categories/SET_SKIP', --num * props.pageSize);
      await store.dispatch('Categories/SELECT_DATA');
      await store.dispatch('Categories/SET_CURRENT_PAGE', num + 1);
      state.loading = false;
    }

    // Changes changes current page to 1 if pageSize is chagned
    watch(
      () => props.pageSize,
      async () => {
        state.loading = true;
        await store.dispatch('Categories/SELECT_DATA');
        changePage(1);
        state.loading = false;
      }
    );

    return {
      content,
      state,
      changePage
    };
  }
};
</script>

<style lang="scss" scoped></style>
