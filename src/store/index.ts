import { createStore } from "vuex";
import user from "./modules/user";
import globalEnv from "./modules/globalEnv";
import getters from "./getters";

export default createStore({
  modules: {
    user: user,
    globalEnv: globalEnv,
  },
  getters: getters,
  strict: true,
});
