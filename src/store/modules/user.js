import { login, getInfoByToken } from "@/api/user";
import { getToken, setToken, removeToken } from "../../../static/utils/auth";
import { getAllGroupsByUserId } from "../../api/group";
import { formatDateTime } from "../../../static/utils/dateUtil";

const user = {
  state: {
    token: getToken(),
    account: "",
    info: {
      id: "",
      username: "",
      nickname: "",
      icon: "",
      birthday: "",
      gender: "",
      introduction: "",
      location: "",
      registeredTime: ""
    },
    ownGroups: [],
    joinGroups: [],
    allGroups: [],
    currentGroup: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NICKNAME: (state, nickname) => {
      state.info.nickname = nickname;
    },
    SET_ICON: (state, icon) => {
      state.info.icon = icon;
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
    SET_OWNGROUPS: (state, groups) => {
      state.ownGroups = groups;
    },
    SET_JOINGROUPS: (state, groups) => {
      state.joinGroups = groups;
    },
    SET_ALLGROUPS: (state, groups) => {
      state.allGroups = groups;
    },
    ADD_ALLGROUPS: (state, groups) => {
      if (!groups || groups.length <= 0) return;
      state.allGroups.push(...groups);
    },
    SET_CURRENTGROUP: (state, groupId) => {
      let groups = state.allGroups.forEach(group => {
        return parseInt(group.id) === parseInt(groupId);
      });
      state.currentGroup =
        groups && groups.size() > 0 ? groups[0] : state.allGroups[0];
    }
  },

  actions: {
    //登录
    Login({ dispatch, commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.account, userInfo.password)
          .then(response => {
            const data = response.data;
            const tokenStr = data.token;
            setToken(tokenStr);
            commit("SET_TOKEN", tokenStr);
            dispatch("GetInfoByToken");
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // //获取用户数据
    GetInfoByToken({ dispatch, commit, state }) {
      if (!this.state.user.token) return;
      return new Promise((resolve, reject) => {
        getInfoByToken()
          .then(response => {
            const data = response.data;
            data.registeredTime = formatDateTime(data.registeredTime);
            data.birthday = formatDateTime(data.birthday);
            commit("SET_ACCOUNT", data.username);
            commit("SET_NICKNAME", data.nickname);
            commit("SET_ICON", data.icon);
            commit("SET_INFO", data);
            return dispatch("getAllGroups", state.info.id);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    //登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        commit("SET_NICKNAME", "");
        commit("SET_USERNAME", "");
        commit("SET_ICON", "");
        commit("SET_ACCOUNT", "");
        commit("SET_INFO", "");
        commit("SET_ALLGROUPS", "");
        commit("SET_JOINGROUPS", "");
        removeToken();
        resolve();
      });
    },
    getAllGroups({ commit }, userId) {
      userId = this.state.user.info.id;
      return new Promise((resolve, reject) => {
        getAllGroupsByUserId(userId)
          .then(function(res) {
            let data = res.data;
            data.forEach(info => {
              info.createdTime = formatDateTime(info.createdTime);
            });
            commit("SET_ALLGROUPS", data);
            commit(
              "SET_OWNGROUPS",
              data.filter(group => {
                return parseInt(group.createdBy) === parseInt(userId);
              })
            );
            commit(
              "SET_JOINGROUPS",
              data.filter(group => {
                return parseInt(group.createdBy) !== parseInt(userId);
              })
            );
            resolve();
          })
          .catch(function(err) {
            console.info("err:" + err);
            reject();
          });
      });
    }
  }
};

export default user;
