<template>
  <div>
    <nav class="topNav">
      <div class="nav">
        <img src="../assets/img/logo.svg" alt="Logo image" class="topNav__logo" :style="state.logo" />

        <div class="hamburger" :class="{ 'is-active': state.isOpen }" @click="toggleIsOpen()" :style="state.hamburger">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
      </div>

      <div class="account" v-if="state.isSignedIn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-avatar>
              <span class="profile-text">{{ state.name[0] + state.name[1] }}</span>
            </el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <div class="dropdown__header">
              <div class="dropdown__header_account">
                <el-avatar>
                  <span class="profile-text">{{ state.name[0] + state.name[1] }}</span>
                </el-avatar>
                <p>{{ state.name }}</p>
              </div>
              <button class="logout" @click="logout()">Logout</button>
            </div>
            <div class="dropdown__body">
              <h5 class="dropdown__body_header">My account</h5>
              <ul class="dropdown__body_links">
                <li><router-link to="/account-settings">Settings</router-link></li>
              </ul>
            </div>
          </template>
        </el-dropdown>
        <p class="account__name">{{ state.name }}</p>
      </div>
      <div class="create-account" v-else-if="!state.isSignedIn">
        <router-link to="/signup" class="sign-btn sign-btn__new">
          <span>Sign Up</span>
        </router-link>
        <router-link to="/signin" class="sign-btn sign-btn__new">
          <span>Sign In</span>
        </router-link>
      </div>
    </nav>

    <nav class="sideNav">
      <el-menu :collapse="!state.isOpen" :router="true" :unique-opened="true" :default-active="route.path" class="el-menu">
        <el-submenu index="1">
          <template #title>
            <img src="../assets/img/icons/pages.svg" alt="Pages image" class="sideNav__icon" />
            <span>Pages</span>
          </template>
          <el-menu-item index="/purchases">Purchases</el-menu-item>
          <el-menu-item index="/categories">Categories</el-menu-item>
        </el-submenu>

        <el-submenu index="2">
          <template #title>
            <img src="../assets/img/icons/links.svg" alt="Links image" class="sideNav__icon" />
            <span>Links</span>
          </template>
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/contact">Contact Us</el-menu-item>
        </el-submenu>

        <el-submenu index="3" v-if="state.isSignedIn">
          <template #title>
            <img src="../assets/img/icons/account.svg" alt="Profile image" class="sideNav__icon" />
            <span>Profile</span>
          </template>
          <el-menu-item index="/account-settings">Settings</el-menu-item>
        </el-submenu>
      </el-menu>
    </nav>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
export default {
  name: 'NavBar',

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      isOpen: false,
      name: computed(() => store.getters['User/GET_NAME']),
      logo: {
        transform: computed(() => {
          if (state.isOpen) return 'translateX(0)';
          return 'translateX(-10rem)';
        })
      },
      hamburger: {
        'margin-left': computed(() => {
          if (state.isOpen) return '12rem';
          return '0';
        })
      },
      isSignedIn: computed(() => store.getters['User/GET_SIGNED_IN'])
    });

    function toggleIsOpen() {
      state.isOpen = state.isOpen === true ? false : true;
      store.dispatch('SET_IS_NAV_OPEN', state.isOpen);
    }

    function logout() {
      let sure = confirm('Are you sure to logout?');
      if (sure) {
        store.dispatch('User/LOG_OUT');
        router.push('/');
      }
    }

    watch(
      () => route.path,
      () => {
        state.isOpen = false;
        store.dispatch('SET_IS_NAV_OPEN', state.isOpen);
      }
    );

    return { state, toggleIsOpen, route, logout };
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/navbar.scss';
</style>
