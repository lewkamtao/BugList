<script setup lang="ts">
import SiderBar from "../components/SiderBar.vue";
import { LewSelect, LewTextarea } from "../components/base/index";
import { Alert } from "../util/alert";
import { uploadHelper } from "../util/uploadHelper";

import axios from "../axios/http";
import { useRoute } from "vue-router";
import { GithubConfig } from "../model/github_config.model";

import { onMounted, ref, watch } from "vue";
import { Bug, BugOptions } from "../model/buglist.model";

// 获取github配置
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem("github_config") as any
);

const route = useRoute();
let bug_list = ref<Bug[]>([] as any);
let bug_option = ref();
bug_option.value = BugOptions;
let active_type: any = ref("");
let upload_loading = ref<boolean[]>([]);

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
  active_type.value = route.params.active_type || "";
});

let sha = ref<string>();

onMounted(() => {
  active_type.value = route.params.active_type || "";
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
      url: `/repositories/${
        github_config.repoId
      }/contents?t=${new Date().getTime()}`,
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
      url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/buglist`,
      data: {
        message: `updated buglist`,
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

// 监听粘贴操作
const PasteUpload = (e: any, i: number) => {
  const items = e.clipboardData.items; //  获取剪贴板中的数据
  let files = [] as any;
  if (items.length > 0) {
    //  判断剪贴板中是否是文件
    for (let file of items) {
      if (file.kind != "file") {
        Alert({
          type: "danger",
          text: `请粘贴图片文件`,
        });
      } else {
        let img = file.getAsFile();
        if (img.type.indexOf("image") >= 0) {
          files.push(img);
        }
      }
    }
    FormatImage(files, i);
  }
};

// 添加图片到上传列表
const FormatImage = async (files: any, i: number) => {
  upload_loading.value[i] = true;
  files = await Promise.all(
    [...files].map((file) => {
      // 等待异步操作完成，返回执行结果
      return uploadHelper(file);
    })
  );
  Upload(files, i);
};

// 上传到github
const Upload = async (files: any, i: number) => {
  let timer = 0;
  await Promise.all(
    files.map((e: any) => {
      return new Promise((resolve) => {
        let filename = `${e.name}_.jpeg`;
        setTimeout(() => {
          axios
            .put({
              url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/buglistImages/${filename}
          `,
              data: {
                message: "upload a image by buglist",
                content: e.base64data,
              },
            })
            .then((res: any) => {
              let cdn_url = `https://cdn.jsdelivr.net/gh/${github_config.owner}/${github_config.repoPath}@master/buglistImages/${filename}`;
              bug_list.value[i].pictrue_list.push(cdn_url);
              resolve(200);
            })
            .catch(() => {
              upload_loading.value[i] = false;
            });
        }, (timer += 1000));
      });
    })
  );
  upload_loading.value[i] = false;
  updateBug();
  Alert({
    type: "success",
    text: "上传完成",
  });
};

const DelPictrue = (i: number, j: number) => {
  bug_list.value[i].pictrue_list.splice(j, 1);
  updateBug();
};
</script>

<template>
  <div class="index-wrapper">
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
          @paste="PasteUpload($event, i)"
          v-for="(bug, i) in bug_list"
          :key="`bug${i}`"
          class="item"
          :class="`bug-${bug.type}`"
          v-show="active_type == '' ? true : bug.type == active_type"
        >
          <div class="left">
            <div class="bug-title">
              <lew-select
                v-model="bug.type"
                :option="bug_option"
                label="type"
                value="type"
              ></lew-select>
            </div>
            <div class="bug-content">
              <LewTextarea
                style="height: 115px; margin-top: 10px"
                @blur="updateBug()"
                v-model="bug.content"
                type="text"
                placeholder="描述"
              ></LewTextarea>
            </div>
          </div>
          <div
            class="right upload-box"
            :class="{ 'upload-loading': upload_loading[i] }"
          >
            <div
              v-for="(pic, j) in bug.pictrue_list"
              :key="`pic${j}`"
              class="img-box"
            >
              <span @click.stop="DelPictrue(i, j)" class="del-btn"
                ><svg
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line></svg
              ></span>
              <a :href="pic" data-fancybox="gallery">
                <img loading="lazy" :src="pic" alt="" srcset=""
              /></a>
            </div>

            <div v-if="bug.pictrue_list.length == 0" class="not-pictrue">
              粘贴图片到此处上传
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-wrapper {
  display: flex;

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
            line-height: 36px;
            min-width: 22px;
            padding: 0px 8px;
            height: 36px;
            font-size: 24px;
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
        background-color: var(--background);
        border-radius: calc(var(--border-radius) * 0.85);
        margin-bottom: 20px;
        overflow: hidden;

        .left {
          width: 50% !important;
          width: 345px;
          margin-right: 20px;
        }
        .right {
          position: relative;
          display: flex;

          width: 50%;
          height: 100%;
          border-radius: calc(var(--border-radius) * 0.65);
          background-color: var(--background-3);
          padding: 15px;
          box-sizing: border-box;
          overflow-x: auto;
          border: 1px var(--background-3) solid;
          .not-pictrue {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--text-color-2);
            opacity: 0.6;
            width: 100%;
            height: 100%;
          }
          .img-box {
            position: relative;
            user-select: none;
            .del-btn {
              position: absolute;
              z-index: 9;
              right: 15px;
              top: 5px;
              opacity: 0;
              cursor: pointer;
              transition: all 0.25s;
            }
          }
          .img-box:hover {
            .del-btn {
              opacity: 1;
            }
          }
          img {
            width: 130px;
            height: 100%;
            object-fit: contain;
            background-color: var(--background);
            margin-right: 10px;
            border: 2px solid var(--background-2);
            border-radius: calc(var(--border-radius) * 0.45);
            flex-shrink: 0;
          }
        }
        .upload-box::after {
          position: absolute;
          top: 50%;
          left: 50%;
          content: "";
          border: 4px solid rgba(194, 194, 194, 0.4);
          border-left-color: var(--primary-color);
          border-radius: 50%;
          width: 14px;
          height: 14px;
          opacity: 0;
          animation: donut-spin 0.8s linear infinite;
          transition: all 0.15s;
          transform: translate(-50%, -50%);
          outline: var(--background) solid 10000px;
          background: var(--background);
        }
        @keyframes donut-spin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .upload-loading:after {
          opacity: 1;
        }
      }

      .bug-danger {
        box-shadow: 0px 8px 0px -5px rgb(141, 19, 19);
      }

      .bug-warning {
        box-shadow: 0px 8px 0px -5px rgb(235, 202, 69);
      }

      .bug-fixed {
        box-shadow: 0px 8px 0px -5px rgb(90, 123, 103);
      }
      .bug-todo {
        box-shadow: 0px 8px 0px -5px rgb(5, 168, 177);
      }
      .bug-pref {
        box-shadow: 0px 8px 0px -5px rgb(93, 102, 118);
      }
    }
  }
}
</style>
