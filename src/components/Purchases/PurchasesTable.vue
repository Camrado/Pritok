<template>
  <div>
    <el-table :data="content" :default-sort="{ prop: 'date', order: 'ascending' }" style="width: 100%" v-loading="state.loading">
      <el-table-column prop="date" label="Date" width="140" />
      <el-table-column prop="category" label="Category" width="160" />
      <el-table-column prop="item" label="Product" />
      <el-table-column prop="price" label="Price" width="90" />
      <el-table-column prop="quantity" label="Quantity" width="100" />
      <el-table-column prop="total_price" label="Total Price" width="130" />
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
      <!-- SHOWING 1 TO 10 OF 43 PURCHASES -->
      <p>
        Showing {{ (state.currentPage - 1) * pageSize + 1 }} to
        <span>{{ state.currentPage * pageSize }}</span>
        of
        {{ state.pageNum.length * pageSize }} purchases
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
import { computed, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import updateBtn from '@/components/Purchases/updateBtn.vue';
import deleteBtn from '@/components/Purchases/deleteBtn.vue';

export default {
  name: 'PurchasesTable',
  components: { updateBtn, deleteBtn },

  props: {
    pageSize: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const store = useStore();
    const content = computed(() => store.getters['Purchases/GET_CONTENT']);

    const state = reactive({
      pageNum: computed(() => {
        let num = store.getters['Purchases/GET_PAGE_NUM'],
          arr = [];
        for (let i = 1; i <= num; i++) {
          arr.push(i);
        }
        return arr; // returns array of nums. E.g. if num = 4 it will return [1, 2, 3, 4]
      }),
      currentPage: computed(() => store.getters['Purchases/GET_CURRENT_PAGE']),
      loading: false
    });

    onMounted(() => {
      store.dispatch('Categories/SET_CONTENT_FOR_PURCHASES'); // For category fields in addPurchase and updatePurchase modal windows
    });

    // For el-pagination.
    async function changePage(num) {
      state.loading = true;
      await store.dispatch('Purchases/SET_SKIP', --num * props.pageSize);
      await store.dispatch('Purchases/SELECT_DATA');
      await store.dispatch('Purchases/SET_CURRENT_PAGE', num + 1);
      state.loading = false;
    }

    // Changes changes current page to 1 if pageSize is chagned
    watch(
      () => props.pageSize,
      async () => {
        state.loading = true;
        await store.dispatch('Purchases/SELECT_DATA');
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
