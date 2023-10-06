<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="all">
    <div class="home">
      <header-bar-Pro :switch_able="switch_able">
        <template v-slot:major>
          <header-menu></header-menu>
        </template>
        <template v-slot:minor>
          <div style="height: 100%; background-color: #0081C6"></div>
        </template>
      </header-bar-Pro>
      <div class="content" @click="changeSwitchAble(!switch_able)">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderMenu from "../components/HeaderMenu";
import { mapState } from "vuex";
import HeaderBarPro from "../components/HeaderBarPro";
// 注意使用组合api比如显性引入  不能直接使用
import { ref, watch, computed } from "vue";

export default {
  name: "Home",
  components: { HeaderBarPro, HeaderMenu },
  mounted() {
    if (this.$route.path === "/group" || !this.userInfo.id) return;
    this.$router.push("/group");
  },
  methods: {
    changeSwitchAble(/*bool*/) {
      this.switch_able = false;
    }
  },
  setup() {
    let switch_able = ref(false);

    let account = computed(
      ...mapState({
        account: state => state.user.account
      })
    );
    let userInfo = computed(() => {
      return this.$store.state.user.info;
    });
    let path = computed(() => {
      return this.$route.path;
    });

    watch(userInfo, val => {
      if (val.id) {
        this.$router.push("/group");
      }
    });
    watch(path, val => {
      if (val.id) {
        if (val === "/" && this.userInfo.id) {
          this.$router.push("/group");
        }
      }
    });

    // 注意 创建好的数据一定要return出去
    return {
      switch_able,
      account,
      userInfo,
      path
    };
  }
};
</script>

<style scoped>
.all {
  background-color: #f9f9f9;
}
.content {
  background-color: #f9f9f9;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  display: block;
}
</style>
