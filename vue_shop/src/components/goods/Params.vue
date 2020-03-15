<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
                show-icon
                title="注意:只允许为第三季分类设置相关参数"
                type="warning"
                :closable="false">
            </el-alert>

            <el-row>
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品分类级联框 -->
                    <el-cascader
                        v-model="selectedKeys"
                        :options="catelist"
                        :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click='addDialogVisible=true'>添加参数</el-button>
                    <el-table :data='manyTableData' border stripe>
                        <el-table-column type='expand'>
                            <template slot-scope="scope">
                                <div>
                                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='handleColse(i,scope.row)'>{{item}}</el-tag>

                                    <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                        >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column type='index'></el-table-column>
                        <el-table-column label='参数名称' prop='attr_name'></el-table-column>
                        <el-table-column label='操作'>
                            <template slot-scope="scope">
                                <div>
                                    <el-button type='primary' icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                    <el-button type='danger' icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click='addDialogVisible=true'>添加属性</el-button>
                     <el-table :data='onlyTableData' border stripe>
                        <el-table-column type='expand'>
                            <template slot-scope="scope">
                                <div>
                                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='handleColse(i,scope.row)'>{{item}}</el-tag>

                                    <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                        >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column type='index'></el-table-column>
                        <el-table-column label='属性名称' prop='attr_name'></el-table-column>
                        <el-table-column label='操作'>
                            <template slot-scope="scope">
                                <div>
                                    <el-button type='primary' icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                    <el-button type='danger' icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>



        <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close='addDialogColsed'
            >
           <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
                <el-form-item :label="titleText" prop='attr_name'>
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
           </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
            </el-dialog>

            <!-- 修改参数对话框 -->
            <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close='editDialogColsed'
            >
           <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
                <el-form-item :label="titleText" prop='attr_name'>
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
           </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            catelist:[],
            //级联选择框的配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择框双向绑定
            selectedKeys:[],
            //被激活的页签的名称
            activeName:'many',
            manyTableData:[],
            onlyTableData:[],
            addDialogVisible:false,
            addForm:{
                attr_name:''
            },
            addFormRules:{
                attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
            },
            editDialogVisible:false,
            editForm:{},
            editFormRules:{
                attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
            },
            inputVisible:false,
            inputValue:'',



            }
    }
,
created(){
    this.getCatelist();
},
methods: {
    async getCatelist(){
        const{data:res} = await this.$http.get('categories');
        if(res.meta.status!==200){
            return this.$message.error('获取分类信息失败');
        }else{
            this.catelist=res.data;
        }
    },
    //级联选择框选中项变化会触发这个函数
    handleChange(){
        this.getParmsData();
        
    },
    //Tab页签点击事件的处理函数
    handleClick(){
        console.log(this.activeName)
        this.getParmsData();
    },
    async getParmsData(){
        if(this.selectedKeys.length!==3){
            this.selectedKeys=[];
            this.manyTableData=[];
            this.onlyTableData=[];
            return
        }else{
           const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
          
           res.data.forEach(item => {
                   item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[];
                   item.inputVisible=false;
                   item.inputValue="";
               });


                console.log(res.data)
           if(res.meta.status!==200){
               return this.$message.error('获取参数列表失败')
           }else{
               console.log(res.data)
               if(this.activeName=='many'){
                   this.manyTableData=res.data;
               }else{
                   this.onlyTableData=res.data;
               }
               
           }
        }
       
        
    },
    addDialogColsed(){
            this.$refs.addFormRef.resetFields();
        },
    async addParams(){
        const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name: this.addForm.attr_name,attr_sel: this.activeName});
        if(res.meta.status!==201){
            return this.$message.error('添加属性失败');

        }else{
            this.$message.success('添加属性成功')
            this.addDialogVisible=false;
            this.getParmsData();
        }
        
    },
    async showEditDialog(attr_id){
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}});
        if(res.meta.status!==200){
            return this.$message.error('获取参数失败')
        }else{
            this.editForm=res.data;
        }
        this.editDialogVisible=true;
    },
    editDialogColsed(){
        this.$refs.editFormRef.resetFields();
    },
    async editParams(){
        const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name , attr_sel:this.activeName})
        if(res.meta.status!==200){
            return this.$message.error('修改失败')
        }else{
            this.$message.success('修改成功')
            this.getParmsData();
            this.editDialogVisible=false;
        }
    },
    async removeParams(id){
         const confirmResult =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err);

        if(confirmResult !=='confirm'){
            return this.$message.info('已取消删除!')
        }else{
            const{data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
            if(res.meta.status!==200){
                return this.$message.error('删除失败')
            }else{
                this.$message.success('删除成功')
                this.getParmsData();
            }
        }
    },
    //文本框失去焦点或enter抬起
    async handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
            row.inputValue=''
            row.inputVisible=false;
            return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible=false;
        this.saveAttrVals(row);
    },
    showInput(row){
            row.inputVisible=true;
            //$nextTick能让页面上的元素被渲染后才执行回调函数里的代码
            this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
        },
    async handleColse(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row);
    },
    async saveAttrVals(row){
        const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.join(' ')
        });
        if(res.meta.status!==200){
            return this.$message.error('修改参数失败')
        }else{
            this.$message.success('修改参数成功')
        }
    },
},
computed:{
    isBtnDisabled(){
        if(this.selectedKeys.length!==3){
            return true
        }else{
            return false
        }
    },
    cateId(){
        if(this.selectedKeys.length==3){
            return this.selectedKeys[2]
        }else{
            return null
        }
    },
    titleText(){
        if(this.activeName ==='many'){
            return '动态属性'
        }
        return '静态属性';
    }
}
}
</script>

<style lang="less" scoped>
    .input-new-tag{
        width: 120px;
    }
</style>