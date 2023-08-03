<template>
  <div class="user_add">
    <h3>用户信息添加</h3>
    <el-form
      :model="addUserForm"
      ref="addUserForm"
      label-width="100px"
      class="demo-addUserForm"
      style="width: 500px"
    >
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="addUserForm.real_name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="name">
        <el-input v-model="addUserForm.phone"></el-input>
      </el-form-item>

      <el-form-item label="生日" prop="date1">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="addUserForm.birthday"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="身份证号" prop="name">
        <el-input v-model="addUserForm.card_id"></el-input>
      </el-form-item>
      <el-form-item label="用户地址" prop="name">
        <el-input v-model="addUserForm.addres"></el-input>
      </el-form-item>
      <el-form-item label="用户备注" prop="name">
        <el-input v-model="addUserForm.mark"></el-input>
      </el-form-item>
      <el-form-item label="登陆密码" prop="name">
        <el-input v-model="addUserForm.pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="name">
        <el-input v-model="addUserForm.true_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="用户等级" prop="region">
        <!-- lebel是给用户看的，value值是将来获取到的实际值 -->
        <el-select v-model="addUserForm.level" placeholder="请选择">
          <el-option
            v-for="item in userLevelList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户分组" prop="region">
        <el-select v-model="addUserForm.group_id" placeholder="请选择">
          <el-option
            v-for="item in userGroupList"
            :label="item.group_name"
            :value="item.id"
            :key="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户标签" id="abc">
        <el-select
          v-model="userLabelNames"
          multiple
          placeholder="请选择用户关联标签"
          @focus="tagSelectVisibleHandler"
          @remove-tag="removeTagHandler"
        >
        </el-select>
      </el-form-item>
      <el-dialog
        title="选择用户标签"
        :visible.sync="UserlabeldialogVisible"
        width="70%"
        :before-close="beforeCloseHandler"
        @close="closeDialogHandler"
      >
        <div class="item" v-for="item in userTagList" :key="item.id">
          <h3>{{ item.name }}</h3>
          <el-tag
            v-for="subitem in item.label"
            :type="subitem.isSelected ? '' : 'info'"
            :key="subitem.id"
            style="margin: 0 2px"
            @click="tagClickHandler(subitem)"
            >{{ subitem.label_name }}</el-tag
          >
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelTagSelectHandler">取 消</el-button>
          <el-button type="primary" @click="confirmTagSelectHandler"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 禁用用户推广资格后，在任何分销模式下用户都无分销资格 -->
      <el-form-item label="推广资格" prop="resource">
        <el-radio-group v-model="addUserForm.spread_open">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推广权限" prop="resource">
        <el-radio-group v-model="addUserForm.is_promoter">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">锁定</el-radio> </el-radio-group
        ><br />
        <span>指定分销模式下，开启或关闭用户的推广权限</span>
      </el-form-item>

      <el-form-item label="用户状态" prop="resource">
        <el-radio-group v-model="addUserForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">锁定</el-radio> </el-radio-group
        ><br />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addUser">立即创建</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import {
  getUserLevelHandler,
  getUserGroupHandler,
  getUserTagHandler,
  addUserHandler,
  getUserByIdHandler,
  editUserHandler,
} from "@/apis/user.js";

export default {
  data() {
    return {
      UserlabeldialogVisible: false,
      addUserForm: {
        uid: 0, // 添加的时候为0，编辑时候是数据的id,编辑和新增共享一个接口
        real_name: "这是姓名",
        phone: "13760719876",
        birthday: "1999-09-09",
        card_id: "420192198707670987",
        addres: "广州968创意园",
        mark: "一个好名字啊",
        pwd: "123456",
        true_pwd: "123456",
        level: "",
        group_id: 1,
        label_id: [],
        spread_open: 1,
        is_promoter: 1,
        status: 1,
      },
      userLevelList: [],
      userGroupList: [],
      userTagList: [],
      userLabelNames: [],
      // 临时数组
      userLabelNamesTemp: [],
      label_idTemp: [],
    };
  },
  async created() {
    this.getUserLevel();
    this.getUserGroup();
    this.getUserTag();

    // 获取用户数据
    let id = this.$route.params.id;
    let res = await getUserByIdHandler(id);
    let userData = res.data.data.ps_info;
    console.log(userData);

    this.addUserForm = {
      uid: id,
      real_name: userData.real_name,
      phone: userData.phone,
      birthday: userData.birthday,
      card_id: userData.card_id,
      addres: userData.addres,
      mark: userData.mark,
      pwd: userData.pwd,
      true_pwd: userData.true_pwd,
      level: userData.level,
      group_id: userData.group_id,
      label_id: [3, 4, 5],
      spread_open: userData.spread_open,
      is_promoter: userData.is_promoter,
      status: userData.status,
    };
    // this.userLabelNames = [3, 4, 5]
    // 根据lobel_id中的id号，找到对应的数据，进行操作
    // 1.将id对应的字符串名称 添加到 userLabelNames
    // 2.将id对应的数据对象的isSelected设置为true
    this.userTagList.forEach((pa) => {
      pa.label.forEach((son) => {
        // 当前要移除的就是当前这个son
        if (this.addUserForm.label_id.indexOf(son.id) != -1) {
          son.isSelected = !son.isSelected;
          this.userLabelNames.push(son.label_name);
        }
      });
    });
  },
  methods: {
    closeDialogHandler() {
      // document.documentElement.style.setProperty('--dropdown_show', 'block');
    },
    // 关闭模态框之前的回调函数--单击右上角的*
    beforeCloseHandler(done) {
      this.resetTagSelectHandler();
      this.userLabelNamesTemp = [];
      this.label_idTemp = [];
      // 将之前选中的值移除
      // document.documentElement.style.setProperty('--dropdown_show', 'block');
      // done()将模态框关闭
      done();
    },
    resetTagSelectHandler() {
      this.userTagList.forEach((pa) => {
        pa.label.forEach((son) => {
          // 当前要移除的就是当前这个son
          if (this.userLabelNamesTemp.indexOf(son.label_name) != -1) {
            son.isSelected = !son.isSelected;
          }
        });
      });
    },
    // 单击模态框的取消
    cancelTagSelectHandler() {
      this.resetTagSelectHandler();
      this.userLabelNamesTemp = [];
      this.label_idTemp = [];
      this.UserlabeldialogVisible = false;
    },
    // 单击模态框的确认:只有在确认的时候，才真正的将临时数组中的数据添加到原始数据对象
    confirmTagSelectHandler() {
      this.userLabelNames = [
        ...this.userLabelNames,
        ...this.userLabelNamesTemp,
      ];

      this.addUserForm.label_id = [
        ...this.addUserForm.label_id,
        ...this.label_idTemp,
      ];
      this.UserlabeldialogVisible = false;

      this.userLabelNamesTemp = [];
      this.label_idTemp = [];
    },
    // 移除下拉列表中的选项---在多选的情况下
    removeTagHandler(v) {
      // v就是移除的tag标签的文本内容
      // 改变当前所删除的Tag项所对应的Tag标签的样式
      // 将数据对象中的label_id中对应的数据id删除
      this.userTagList.forEach((pa) => {
        pa.label.forEach((son) => {
          // 当前要移除的就是当前这个son
          if (v == son.label_name) {
            son.isSelected = !son.isSelected;
            // 删除数据对象中的label_id数组中的数据
            this.addUserForm.label_id = this.addUserForm.label_id.filter(
              (id) => id != son.id
            );
          }
        });
      });
    },
    // 单击模态框中的具体的标签项
    tagClickHandler(current) {
      // 让样式有一个变化
      current.isSelected = !current.isSelected;
      // 查找元素在数组中第一次出现的索引位置，如果能找到就返回对应的索引(索引>=0),如果找不到则返回-1
      let index = this.label_idTemp.indexOf(current.id);
      // 判断：当前Tag是否已经被添加了，如果被添加了，此次单击应该是移除
      if (index == -1) {
        // 进行数据的收集（移除）
        this.userLabelNamesTemp.push(current.label_name);
        // 将当前被选中的tag所对应的数据对象的id存储到数组
        this.label_idTemp.push(current.id);
      } else {
        this.userLabelNamesTemp.splice(index, 1);
        this.label_idTemp.splice(index, 1);
      }
    },
    // 单击标签下拉列表，切换选项的显示和隐藏时触发
    tagSelectVisibleHandler() {
      this.UserlabeldialogVisible = true;
      // 将样式重置为none
      // document.documentElement.style.setProperty('--dropdown_show', 'none');
    },

    async addUser() {
      if (this.addUserForm.uid) {
        let res = await editUserHandler(this.addUserForm);
      } else {
        let res = await addUserHandler(this.addUserForm);
      }
      this.$message.success("操作成功");
      this.$router.push("/user/manager");
    },
    async getUserLevel() {
      let res = await getUserLevelHandler();

      this.userLevelList = res.data.data.list;
      this.addUserForm.level = this.userLevelList[0].id;
    },
    async getUserGroup() {
      let res = await getUserGroupHandler();

      this.userGroupList = res.data.data.list;
      this.addUserForm.group_id = this.userGroupList[0].id;
    },
    async getUserTag() {
      let res = await getUserTagHandler();
      this.userGroupList = res.data.data.list;
      // 为了能够在单击单个标签的时候，对标签的样式进行控制，我们需要为每个标签所对应的数据添加标识
      this.userTagList = res.data.data.map((v) => {
        v.label = v.label.map((subv) => {
          return {
            ...subv,
            isSelected: false,
          };
        });
        return v;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  cursor: pointer;
}
.el-select {
  width: 400px;
  // color: rgb(253, 67, 34);
}
</style>
