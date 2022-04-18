<script setup lang="ts">
import Header from "./components/Header.vue";
import { onMounted } from "vue";
onMounted(() => {
  if (!!localStorage.getItem("github_config")) {
    let github_config = JSON.parse(
      localStorage.getItem("github_config") as any
    );
    if (github_config.isDark) {
      document.getElementsByTagName("html")[0].classList.add("dark");
    } else {
      document.getElementsByTagName("html")[0].classList.remove("dark");
    }
  }
});
</script>

<template>
  <div class="wrapper">
    <div id="alert-box"></div>

    <Header />
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  .container {
    max-width: 1200px;
    min-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 30px;
  }
}
</style>
