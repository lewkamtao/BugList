import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { GithubConfig } from "../model/github_config.model";
import { Alert } from "../util/alert";

import Index from "../views/Index.vue";
import Bug from "../views/Bug.vue";
import Setting from "../views/Setting.vue";
import NotFound from "../views/NotFound.vue";

let github_config: GithubConfig = {
  owner: "",
  repoId: "",
  repoPath: "",
  name: "",
  avatarUrl: "",
  isDark: false,
};

const getRepoId = () => {
  github_config = JSON.parse(localStorage.getItem("github_config") as any);
  return github_config?.repoId || "";
};

const GetIndexPath = () => {
  github_config = JSON.parse(localStorage.getItem("github_config") as any);
  if (github_config?.repoId) {
    return `/${github_config?.repoId}`;
  } else {
    return "/setting";
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: GetIndexPath(),
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    meta: {},
  },
  {
    path: "/:repoId",
    name: "Bug",
    component: Bug,
    meta: {},
  },
  {
    path: "/:repoId/:active_type",
    name: "BugById",
    component: Bug,
    meta: {},
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
    meta: {},
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];
const router = createRouter({
  history: createWebHashHistory(""),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  if (to.path != "/setting") {
    if (getRepoId()) {
      next();
    } else {
      Alert({
        type: `danger`,
        text: "请先授权",
      });
      next("setting");
    }
  } else {
    next();
  }
});

export default router;
