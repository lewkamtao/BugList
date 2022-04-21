<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import axios from '../axios/http'
import { Alert } from '../util/alert'
import { GithubConfig } from '../model/github_config.model'

const router = useRouter()
const route = useRoute()

let isDark = ref(false)

watch(route, () => {
  if (route.params?.repoId) {
    github_config.value = JSON.parse(
      localStorage.getItem('github_config') as any
    )
    GetRepos()
  }
})

// 获取github配置
let github_config = ref<GithubConfig>({} as GithubConfig)

onMounted(() => {
  github_config.value = JSON.parse(localStorage.getItem('github_config') as any)
  isDark.value = !!JSON.parse(localStorage.getItem('isDark') as any)
  setDarkModel(isDark.value)
  if (!!github_config.value) {
    GetRepos()
  } else {
    github_config.value = {
      owner: '',
      repoId: '',
      repoPath: '',
      name: '',
      avatarUrl: '',
      isDark: false,
    }
  }
})

const toPath = (path: string) => {
  if (!github_config.value.repoId) {
    Alert({
      type: 'danger',
      text: '请先进行 Github 授权',
    })
    router.push('/setting')
  } else {
    router.push(path)
  }
}

const repos = ref([] as any)
const GetRepos = () => {
  axios
    .get({
      url: `/users/${github_config.value.owner}/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data
    })
}

const changeRepoPath = () => {
  github_config.value.repoId = repos.value.find(
    (e: any) => e.name == github_config.value.repoPath
  ).id
  Save()
}

const Save = () => {
  localStorage.setItem('github_config', JSON.stringify(github_config.value))
  location.reload()
}

const setDarkModel = (val) => {
  if (val) {
    document.getElementsByTagName('html')[0].classList.add('dark')
  } else {
    document.getElementsByTagName('html')[0].classList.remove('dark')
  }
  isDark.value = val
  localStorage.setItem('isDark', JSON.stringify(val))
}
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
    <div class="rigth">
      <div class="change-dark-btn">
        <svg
          @click="setDarkModel(true)"
          v-show="!isDark"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="css-i6dzq1 son"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg
        ><svg
          @click="setDarkModel(false)"
          v-show="isDark"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="css-i6dzq1 moon"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
      <a
        class="github"
        target="_blank"
        href="https://github.com/lewkamtao/BugList"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="css-i6dzq1"
        >
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          ></path>
        </svg>
      </a>
      <div @click="toPath(`/setting`)" class="avatar">
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
          alt=""
          srcset=""
        />
      </div>
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
  .rigth {
    display: flex;
    align-items: center;
    user-select: none;
    > div {
      display: flex;
      align-items: center;
    }
    > a {
      display: flex;
      align-items: center;
    }
    .change-dark-btn {
      margin-right: 50px;
      svg {
        cursor: pointer;
      }
    }
    .github {
      margin-right: 50px;
    }
    .avatar {
      width: 35px;
      height: 35px;
      background-color: var(--background-2);
      border-radius: 50px;
      overflow: hidden;
      cursor: pointer;
      margin-right: 20px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
