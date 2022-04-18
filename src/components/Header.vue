<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import axios from "../axios/http";
import { Alert } from "../util/alert";
import { GithubConfig } from "../model/github_config.model";

const router = useRouter();
const route = useRoute();

watch(route, () => {
  if (route.params?.repoId) {
    github_config.value = JSON.parse(
      localStorage.getItem("github_config") as any
    );
    GetRepos();
  }
});

// 获取github配置
let github_config = ref<GithubConfig>({} as GithubConfig);

onMounted(() => {
  github_config.value = JSON.parse(
    localStorage.getItem("github_config") as any
  );
  if (!!github_config.value) {
    GetRepos();
  } else {
    github_config.value = {
      owner: "",
      repoId: "",
      repoPath: "",
      name: "",
      avatarUrl: "",
      isDark: false,
    };
  }
});

const toPath = (path: string) => {
  if (!github_config.value.repoId) {
    Alert({
      type: "danger",
      text: "请先进行 Github 授权",
    });
    router.push("/setting");
  } else {
    router.push(path);
  }
};

const repos = ref([] as any);
const GetRepos = () => {
  axios
    .get({
      url: `/users/${github_config.value.owner}/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data;
    });
};

const changeRepoPath = () => {
  github_config.value.repoId = repos.value.find(
    (e: any) => e.name == github_config.value.repoPath
  ).id;
  Save();
};

const Save = () => {
  localStorage.setItem("github_config", JSON.stringify(github_config.value));
  location.reload();
};

const changeDarkModel = (e: any) => {
  if (e.target.checked) {
    document.getElementsByTagName("html")[0].classList.add("dark");
  } else {
    document.getElementsByTagName("html")[0].classList.remove("dark");
  }
};
</script>

<template>
  <div class="header">
    <div @click="toPath(`/${github_config.repoId}`)" class="logo">
      BUG <span>List</span> <i v-if="github_config.repoPath">/</i>
      <select
        v-if="github_config.repoPath"
        @click.stop
        class="project-name"
        v-model="github_config.repoPath"
        placeholder="未选择"
        @change="changeRepoPath"
      >
        <option v-for="(item, index) in repos" :key="index" :value="item.name">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div @click="toPath(`/setting`)" class="avatar">
      <img
        src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
        alt=""
        srcset=""
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0px 20px;
  box-sizing: border-box;
  background-color: var(--background);
  box-shadow: var(--border-shadow);

  .logo {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 900;
    cursor: pointer;
    span {
      margin-left: 4px;
      margin-right: 6px;
      padding: 0px 8px;
      font-size: 22px;
      border-radius: calc(var(--border-radius) * 0.25);
      background-color: #739491;
      color: #fff;
    }
    .project-name {
      padding: 2px;
      margin-left: 4px;
      font-weight: 400;
      font-size: 22px;
      color: #999;
      border: none;
      outline: none;
      background-color: var(--background);
      border-radius: calc(var(--border-radius) * 0.25);
    }
    .project-name:hover {
      background-color: var(--background-2);
    }
  }
  .avatar {
    width: 35px;
    height: 35px;
    background-color: var(--background-2);
    border-radius: 50px;
    overflow: hidden;
    cursor: pointer;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
