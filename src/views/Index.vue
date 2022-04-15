<script setup lang="ts">
import SiderBar from "../components/SiderBar.vue";
import axios from "../axios/http";
import { useRoute } from "vue-router";

import { onMounted, ref, watch } from "vue";
import { Bug, BugOptions } from "../model/buglist.model";
import router from "../router";

const route = useRoute();
let bug_list = ref<Bug[]>([]);
let bug_option = ref(BugOptions);
let active_type: any = ref("");

let bug_group = ref({
  all: 0,
  pref: 0,
  warning: 0,
  danger: 0,
  fixed: 0,
  todo: 0,
});

watch(
  bug_list,
  () => {
    bug_group.value = {
      all: bug_list.value.length,
      pref: bug_list.value.filter((e) => e.type == "pref").length,
      warning: bug_list.value.filter((e) => e.type == "warning").length,
      danger: bug_list.value.filter((e) => e.type == "danger").length,
      fixed: bug_list.value.filter((e) => e.type == "fixed").length,
      todo: bug_list.value.filter((e) => e.type == "todo").length,
    };
  },
  { deep: true, immediate: true }
);

watch(route, () => {
  active_type.value = route.path.substring(1);
});

let sha = ref<string>();

onMounted(() => {
  active_type.value = route.path.substring(1);
  GetFolders();
});

const addBug = (type: string) => {
  bug_list.value.unshift({
    content: "",
    create_time: "",
    update_time: "",
    type: type,
    pictrue_list: [],
  });
  updateBug();
};

const GetFolders = () => {
  axios
    .get({
      url: `/repositories/474355047/contents?t=${new Date().getTime()}`,
    })
    .then((res: any) => {
      let buglist = res.data.find((e: any) => e.name == "buglist");
      if (!buglist) {
        updateBug();
      } else {
        sha.value = buglist.sha;
        axios
          .get({ url: `${buglist.url}&${new Date().getTime()} ` })
          .then((res: any) => {
            // 对base64转编码
            var decode = decodeURIComponent(
              escape(window.atob(res.data.content))
            );
            bug_list.value = JSON.parse(decode);
            if (bug_list.value.length == 0) {
              addBug("pref");
            }
          });
      }
    });
};

const updateBug = () => {
  axios
    .put({
      url: `/repos/lewkamtao/PicHub-Cloud/contents/buglist
          `,
      data: {
        message: "updated a buglist",
        sha: sha.value,
        content: window.btoa(
          unescape(encodeURIComponent(JSON.stringify(bug_list.value)))
        ),
      },
    })
    .then((res: any) => {
      sha.value = res.data.content.sha;
    });
};
</script>

<template>
  <div class="wrapper">
    <SiderBar :bug_group="bug_group" />
    <div class="main">
      <div class="bug-list">
        <div class="header">
          <div class="title">
            {{
              active_type == ""
                ? "全部"
                : bug_option.find((e) => e.type == active_type).title
            }}
            <span class="total">{{
              active_type == ""
                ? bug_list.length
                : bug_list.filter((e) => e.type == active_type).length
            }}</span>
          </div>

          <svg
            @click="addBug(active_type == '' ? 'pref' : active_type)"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="css-i6dzq1 add-btn"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div
          v-for="(bug, index) in bug_list"
          :key="index"
          class="item"
          v-show="active_type == '' ? true : bug.type == active_type"
        >
          <div class="left">
            <div class="bug-title">
              <select
                v-model="bug.type"
                @change="updateBug"
                placeholder="未选择"
              >
                <option
                  v-show="item.type != 'all'"
                  v-for="item in bug_option"
                  :value="item.type"
                  :key="item.type"
                >
                  {{ item.title }}
                </option>
              </select>
            </div>
            <div class="bug-content">
              <textarea
                @blur="updateBug()"
                v-model="bug.content"
                type="text"
                placeholder="描述"
              ></textarea>
            </div>
          </div>
          <div class="right">
            <a
              v-for="(pic, index) in bug.pictrue_list"
              href="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
              data-fancybox="gallery"
            >
              <img
                loading="lazy"
                src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
                alt=""
                srcset=""
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 30px;
}
.main {
  width: calc(100% - 350px);
  height: 100%;
  margin-left: 40px;
  border-radius: calc(var(--border-radius) * 0.85);
  .bug-list {
    width: 100%;
    margin: 0px auto;

    border-radius: calc(var(--border-radius) * 0.75);
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 0px 30px 0px;

      .title {
        font-weight: bolder;
        font-size: 30px;
        .total {
          display: inline-block;
          text-align: center;
          line-height: 40px;
          min-width: 25px;
          padding: 0px 8px;
          height: 40px;
          font-size: 26px;
          color: #000;
          background-color: rgba($color: #fff, $alpha: 0.65);
          border-radius: calc(var(--border-radius) * 0.45);
        }
      }
      .add-btn {
        width: 28px;
        margin-top: 5px;
        margin-right: 35px;
        height: 28px;
        cursor: pointer;
        transition: all 0.25s;
      }
      .add-btn:hover {
        transform: scale(1.1);
      }
      .add-btn:active {
        transform: scale(1);
      }
    }

    .item {
      display: flex;
      padding: 25px;
      box-sizing: border-box;
      height: 220px;
      background-color: #fff;
      border-radius: calc(var(--border-radius) * 0.85);
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: var(--border-shadow);

      input,
      select,
      textarea {
        border: none;
        outline: none;
        background: #f5f4f6;
        width: 100% !important;
        padding: 10px;
        font-size: 16px;
        box-sizing: border-box;
        border-radius: calc(var(--border-radius) * 0.55);
      }
      select {
        cursor: pointer;
      }
      select,
      input {
        height: 45px;
        margin-bottom: 10px;
      }
      textarea {
        height: 115px !important;
        resize: none;
        padding: 14px;
      }
      .left {
        width: 50% !important;
        width: 345px;
        margin-right: 20px;
      }
      .right {
        display: flex;

        width: 50%;
        height: 100%;
        border-radius: calc(var(--border-radius) * 0.65);
        background-color: #f5f4f6;
        padding: 15px;
        box-sizing: border-box;
        overflow-x: auto;
        border: 1px #f5f4f6 solid;

        img {
          width: auto;
          height: 100%;
          object-fit: cover;
          background-color: #ffffff;
          margin-right: 10px;
          border-radius: calc(var(--border-radius) * 0.45);
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
