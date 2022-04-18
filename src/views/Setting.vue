<script setup lang="ts">
import { Alert } from "../util/alert";
import {
  LewButton,
  LewFormItem,
  LewSwitch,
  LewInput,
  LewSelect,
} from "../components/base";
import { useRouter } from "vue-router";
import { GithubConfig } from "../model/github_config.model";
import axios from "../axios/http";
import { onMounted, reactive, ref } from "vue";

const router = useRouter();
let github_config: any = ref({} as GithubConfig);
onMounted(() => {
  if (!!localStorage.getItem("github_config")) {
    github_config.value = JSON.parse(
      localStorage.getItem("github_config") as any
    );
  } else { 
    github_config.value.repoId = "";
  }
  if (!!localStorage.getItem("token")) {
    token.value = localStorage.getItem("token");

    GetUser();
  }
});

const repos = ref([] as any);
let token = ref("" as any);

let loading_1 = ref(false);
let loading_2 = ref(false);
let loading_3 = ref(false);
let loading_4 = ref(false);

const GetUser = () => {
  axios
    .get({
      url: `/user`,
    })
    .then((res: any) => {
      github_config.value.owner = res.data.login;
      github_config.value.name = res.data.name;
      github_config.value.avatarUrl = res.data.avatar_url;
      localStorage.setItem(
        "github_config",
        JSON.stringify(github_config.value)
      );
      GetRepos();
    })
    .catch(() => {
      loading_1.value = false;
      loading_4.value = false;
    });
};

const SetToken = () => {
  localStorage.setItem("token", token.value);
  GetUser();
};

const GetRepos = () => {
  axios
    .get({
      url: `/users/${github_config.value.owner}/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data;
      loading_1.value = false;

      if (
        !github_config.value.repoId &&
        token.value == "ghp_nHrGvW63OTlLac" + "" + "FH4WOHto6sYhS7yD1Us6Ta"
      ) {
        github_config.value.repoId = 480610843;
        Save();
      }
    });
};

const Save = () => {
  if (!github_config.value.repoId) {
    Alert({
      type: "warning",
      text: "请选择仓库",
    });
    return;
  }
  loading_2.value = true;
  github_config.value.repoPath = repos.value.find(
    (e) => github_config.value.repoId == e.id
  ).name;
  localStorage.setItem("github_config", JSON.stringify(github_config.value));

  setTimeout(() => {
    Alert({
      type: "success",
      text: "保存成功！",
    });
    loading_2.value = false;
    router.push(`/${github_config.value.repoId}`);
  }, 500);
};

const Exit = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("github_config");
  localStorage.removeItem("history_list");

  loading_3.value = true;
  Alert({
    type: "success",
    text: "退出成功",
  });
  setTimeout(() => {
    loading_3.value = false;
    location.reload();
  }, 500);
};
</script>

<template>
  <div class="setting-wrapper">
    <div class="form">
      <div v-if="!github_config.name" class="title-1">开始</div>
      <div v-show="github_config.name" class="user-info">
        <img class="avatar" :src="github_config.avatarUrl" alt="" srcset="" />
        <div class="name">{{ github_config.name }}</div>
      </div>
      <div class="form">
        <lew-form-item
          title="Github access token"
          small_title="如何获取？"
          small_title_link="https://juejin.cn/post/6989307240633073700"
          :tips="
            repos.length == 0
              ? `注意： <br />Pichub不会对你的 access token
          进行储存和转移，它只会储存在你的本机的浏览器内，所以它是相对安全的。如果你试图去浏览器的缓存中清除掉它，你会发现，它需要重新登陆了，但我们不推荐这样操作。
         `
              : ''
          "
        >
          <lew-input
            :disabled="repos.length > 0"
            v-model="token"
            placeholder="请输入"
          ></lew-input>
        </lew-form-item>

        <lew-form-item v-show="repos.length > 0" title="选择一个 Github 仓库">
          <lew-select
            v-model="github_config.repoId"
            :option="repos"
            label="name"
            value="id"
          ></lew-select>
        </lew-form-item>
      </div>

      <lew-button
        type="primary"
        v-show="repos.length == 0"
        @click="(loading_1 = true), SetToken()"
        :loading="loading_1"
      >
        确定
      </lew-button>
      <lew-button
        type="gray"
        v-show="repos.length == 0"
        @click="
          ((loading_4 = true),
          (token = 'ghp_nHrGvW63OTlLac' + '' + 'FH4WOHto6sYhS7yD1Us6Ta')),
            SetToken()
        "
        :loading="loading_4"
      >
        少废话，先看东西。
      </lew-button>
      <lew-button
        type="primary"
        v-show="repos.length > 0"
        @click="Save()"
        :loading="loading_2"
      >
        保存并开始
      </lew-button>
      <lew-button
        type="danger"
        v-show="repos.length > 0"
        @click="Exit()"
        :loading="loading_3"
      >
        退出登录
      </lew-button>
    </div>
  </div>
</template>
<style></style>

<style lang="scss" scoped>
.setting-wrapper {
  width: 100%;
  height: auto;
  background-color: var(--background);
  padding: 120px 50px;
  box-sizing: border-box;
  border-radius: calc(var(--border-radius) * 0.85);
  box-shadow: var(--border-shadow);
}
.form {
  width: 400px;
  margin: 0 auto;
}
.title-1 {
  margin-bottom: 20px;
  color: var(--text-color-1);
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px 0px;
  .avatar {
    width: 150px;
    border-radius: 50%;
    border: var(--border-width) var(--border-color) solid;
  }
  .name {
    margin-top: 5px;
    font-size: 18px;
    line-height: 32px;
    margin-left: 10px;
    color: var(--text-color);
  }
}

.token-demo {
  width: 100%;
  background-color: rgb(243, 255, 245);
  border-radius: 14px;
  margin-bottom: 20px;
  padding: 15px;
  line-height: 30px;
}
</style>
