<template>
  <div class='wnheader'>
    <div>
      <span class='el-icon-d-arrow-left'></span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{userInfo.account}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: '',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    // 相当于
    // userInfo () {
    //   return this.$store.userInfo
    // }
  },
  methods: {
  }
}
</script>
<style lang='less' scoped>
.wnheader {
  border-bottom: 2px solid #ddd;
  > div {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
  }
}
</style>