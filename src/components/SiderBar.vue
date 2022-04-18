<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { GithubConfig } from "../model/github_config.model";
import axios from "../axios/http";

import { BugOptions } from "../model/buglist.model";
const router = useRouter();
const route = useRoute();

let active_type: any = ref("");
// 获取github配置
let github_config = ref<GithubConfig>({} as GithubConfig);

onMounted(() => {
  github_config.value = JSON.parse(
    localStorage.getItem("github_config") as any
  );
  active_type.value = route.params.active_type || "";
  GetContributors();
});
watch(route, () => {
  document.body.scrollTop = 0;
  // firefox
  document.documentElement.scrollTop = 0;
  active_type.value = route.params.active_type || "";
});

const props = defineProps({
  bug_group: Object as any,
});
let bug_option: any = ref(BugOptions);
const { bug_group } = toRefs(props);

const changeBugType = (e) => {
  router.push(
    `/${github_config.value.repoId}${e.type == "all" ? "" : "/" + e.type}`
  );
};

let contributors = ref([]);

const GetContributors = () => {
  axios
    .get({
      url: `/repos/${github_config.value.owner}/${github_config.value.repoPath}/contributors`,
    })
    .then((res: any) => {
      contributors.value = res.data;
    });
};
</script>

<template>
  <div class="siderbar">
    <div
      class="item"
      @click="changeBugType(item)"
      v-for="(item, index) in bug_option"
      :key="index"
      :class="{
        active:
          item.type == active_type || (item.type == 'all' && active_type == ''),
      }"
    >
      <div class="icon" v-html="item.icon"></div>
      {{ item.title }}<span class="total">{{ bug_group[item.type] }}</span>
    </div>
    <div class="user-box">
      <div class="title">团队成员</div>
      <div class="user-avatar-box">
        <div class="user" v-for="(item, index) in contributors" :key="index">
          <img :src="item.avatar_url" alt="" srcset="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.siderbar {
  position: sticky;
  display: flex;
  flex-direction: column;
  width: 320px;
  height: calc(100% - 40px);
  top: 30px;
  background: var(--background);
  border-radius: calc(var(--border-radius) * 0.85);
  padding: 30px;
  box-sizing: border-box;
  box-shadow: var(--border-shadow);

  .project-name {
    padding: 14px 20px;
    font-size: 18px;
    font-weight: 900;
  }
  .user-box {
    margin-top: 50px;
    padding: 14px 20px;
    .title {
      font-weight: bolder;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .user-avatar-box {
      display: flex;
      flex-wrap: wrap;
      img {
        width: 37px;
        height: 37px;
        border-radius: 50px;
        margin-right: 6px;
        margin-bottom: 6px;
        cursor: pointer;
      }
    }
  }
  .item {
    position: relative;
    padding: 12px 20px;
    margin-bottom: 5px;
    font-size: 16px;
    display: flex;
    align-items: center;
    border-radius: calc(var(--border-radius) * 0.65);
    cursor: pointer;
    .icon {
      width: 18px;
      height: 18px;
      margin-right: 14px;
    }
    .total {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bolder;
      background-color: var(--background-3);
      color: var(--text-color-2);
      padding: 3px 5px;
      font-size: 14px;
      min-width: 14px;
      height: 18px;
      text-align: center;
      border-radius: calc(var(--border-radius) * 0.35);
    }
  }
  .item:hover {
    background-color: var(--background-2);
  }
  .active {
    background-color: var(--background-2);
  }
}
</style>
