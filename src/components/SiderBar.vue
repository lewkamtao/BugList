<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import { BugOptions } from "../model/buglist.model";
const router = useRouter();
const route = useRoute();

onMounted(() => {
  active_type.value = route.path.substring(1);
});

let active_type: any = ref("");
watch(route, () => {
  document.body.scrollTop = 0;
  // firefox
  document.documentElement.scrollTop = 0;
  active_type.value = route.path.substring(1);
});

const props = defineProps({
  bug_group: Object as any,
});
let bug_option: any = ref(BugOptions);
const { bug_group } = toRefs(props);

const changeBugType = (e) => {
  for (const iterator of bug_option.value) {
    document
      .getElementsByTagName("html")[0]
      .classList.remove(`bg-${iterator.type}`);
  }
  router.push(`/${e.type == "all" ? "" : e.type}`);
  document.getElementsByTagName("html")[0].classList.add(`bg-${e.type}`);
};
</script>

<template>
  <div class="sider-bar">
    <div class="logo">BUG <span>List</span></div>
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
      <div class="title">开发人员</div>
      <div class="user-avatar-box">
        <img
          src="https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com/public/blog/images/clipboard_20220312_125858.png"
          alt=""
          srcset=""
        />
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
          alt=""
          srcset=""
        />
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
          alt=""
          srcset=""
        />
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
          alt=""
          srcset=""
        />
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
          alt=""
          srcset=""
        />
        <img
          src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
          alt=""
          srcset=""
        />
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
.sider-bar {
  position: sticky;
  display: flex;
  flex-direction: column;
  width: 320px;
  height: calc(100% - 40px);
  top: 30px;
  background: #fff;
  border-radius: calc(var(--border-radius) * 0.85);
  padding: 20px 30px 30px 30px;
  box-sizing: border-box;
  box-shadow: var(--border-shadow);
  .logo {
    padding: 14px 20px;
    font-size: 35px;
    font-weight: 900;
    span {
      margin-left: -4px;
      padding: 0px 8px;
      border-radius: calc(var(--border-radius) * 0.25);
      background-color: #739491;
      color: #fff;
    }
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
        width: 46px;
        height: 46px;
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
      background-color: #eae8ea;
      color: #69696d;
      padding: 3px 5px;
      font-size: 14px;
      min-width: 14px;
      height: 18px;
      text-align: center;
      border-radius: calc(var(--border-radius) * 0.35);
    }
  }
  .item:hover {
    background-color: #f5f4f6;
  }
  .active {
    background-color: #f5f4f6;
  }
}
</style>
