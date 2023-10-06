// @ts-nocheck
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 其它组件
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import { ElMessage } from "element-plus";

import "vue-awesome/icons/flag";
import VDistpicker from "v-distpicker"; //地区选择
//文本编辑器
import Editor from "./components/Editor";
//mavon
import MarkdownEditor from "./components/MarkdownEditor";
//markdown-it-vue
import VueMarkdownIt from "vue3-markdown-it";

import VueQuillEditor from "vue-quill-editor";
// require styles 引入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

//import SvgIcon from "@/components/SvgIcon"; //svg组件

export const app = createApp(App);

app
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueQuillEditor)
  .component("VueMarkdownIt", VueMarkdownIt)
  .component("v-distpicker", VDistpicker)
  .component("MarkdownEditor", MarkdownEditor)
  .component("Editor", Editor);
  //.component("svg-icon", SvgIcon);

//elementUI消息框封装
app.config.globalProperties.$elementMessage = function(msg, t, d) {
  ElMessage({
    message: msg,
    type: t,
    during: d,
    showClose: true,
    center: true
  });
};

app.mount("#app");

const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context("./icons/svg", false, /\.svg$/);
requireAll(req);