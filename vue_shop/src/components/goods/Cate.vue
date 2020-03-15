<template>
    <div>
        商品分类组件

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <tree-table :data='catelist' :columns='columns' :selection-type="false" :expand-type='false' show-index index-text='#' border :show-row-hover='false'>
                <template slot='isok' slot-scope="scope">
                    <div>
                        <i class="el-icon-success" v-if='scope.row.cat_deleted==false' style='color:green'></i>
                        <i class="el-icon-error" v-else style="color:red"></i>
                    </div>
                </template>
                <template slot='order' slot-scope="scope">
                    <div>
                        <el-tag size='mini' v-if="scope.row.cat_level===0">一级</el-tag>
                        <el-tag size='mini' type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                        <el-tag size='mini' type='warning' v-else>三级</el-tag>
                    </div>
                </template>

                <template slot='opt' slot-scope="scope">
                    <div>
                        <el-button type="primary" icon='el-icon-edit' size="mini" @click="editCateId(scope.row.cat_id,scope.row.cat_name)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserByID(scope.row.cat_id)" >删除</el-button>
                        
                    </div>
                </template>
            </tree-table>
            

            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3,5, 10, 15]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>


        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close='addCateDialogColse'
            >
            <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
                <el-form-item label="分类名称:" prop='cat_name'>
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>

                <!-- options用来指定数据源 -->
                <!-- props用来指定配置对象 -->
                <el-form-item label="父级名称:">
                     <el-cascader
                     expand-trigger="hover"
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChanged" clearable change-on-select></el-cascader>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>


            <el-dialog
            title="编辑名称"
            :visible.sync="editCateDialogVisible"
            width="50%"
            >
           <el-form ref="" :model="editCateList" label-width="100px" :rules="editCateFormRules">
                <el-form-item label="分类名称:" prop='editCateName'>
                    <el-input v-model="editCateList.editCateName"></el-input>
                </el-form-item>
           </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
            </el-dialog>


    </div>





</template>

<script>
export default {
    data(){
        return{
             querInfo:{
              type: 3,
              pagenum: 1,
              pagesize: 5
                },
            catelist:[],
            total:0,
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                type:'template',
                //表示当前这一列的模板名称
                template:'isok'
            },{
                label:'排序',
                type:'template',
                template:'order'
            },{
                label:'操作',
                type:'template',
                template:'opt'
            }],
            addCateDialogVisible:false,
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0,
            },
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}]
            },
            editCateFormRules:{
                editCateName:[
                     {required:true,message:'请输入分类名称',trigger:'blur'}]
                
            },
            //父级分类的列表
            parentCateList:[],

            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },

            //选中的父级分类的ID数组
            selectedKeys:[],
            editCateDialogVisible:false,
            editCateList:{
                editCateId:'',
                editCateName:''
            },
            
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const{data:res} =await this.$http.get('categories',{ params: this.querInfo});
            if(res.meta.status!=200){
                return this.$message.error('获取商品分类失败!')
            }else{
                this.catelist=res.data.result;
                this.total=res.data.total;
                console.log(res.data)
            }
        },
        //监听pagesize改变
        handleSizeChange(newSize){
            this.querInfo.pagesize=newSize;
            this.getCateList();
        },
        handleCurrentChange(newPage){
            this.querInfo.pagenum=newPage;
            this.getCateList();
        },
        showAddCateDialog(){
            this.getParentCateList();
            this.addCateDialogVisible=true;
            
        },
        async getParentCateList(){
         const{data:res}=await this.$http.get('categories',{params:{type:2}});
         console.log(res.data)
        this.parentCateList=res.data;
        },
        //选择项发生变化出发这个函数
        parentCateChanged(){
            // console.log(this.selectedKeys)
            if(this.selectedKeys.length>0){
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];
                this.addCateForm.cat_level=this.selectedKeys.length;

                return
            }else{
                this.addCateForm.cat_pid=0;
                this.addCateForm.cat_level=0;
            }
        },
        addCate(){
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid)return;
                  const { data: res } = await this.$http.post('categories',this.addCateForm)

                if(res.meta.status!==201){
                    return this.$message.error('添加分类失败!')
                }else{
                    this.$message.success('添加分类成功');
                    this.getCateList();
                    this.addCateDialogVisible=false;
                }
            })
        },
        addCateDialogColse(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys=[];
            this.addCateForm.cat_level=0;
            this.addCateForm.cat_pid=0;
        },
        editCateId(cateid,catename){
            
            this.editCateList.editCateId=cateid;
            this.editCateList.editCateName=catename;
            this.editCateDialogVisible=true;
        },
        async editCate(){
            const{data:res} = await this.$http.put('categories/'+this.editCateList.editCateId,{cat_name:this.editCateList.editCateName});
            if(res.meta.status!==200){
                return this.$message.error('更改分类名称失败');
            }else{
                this.$message.success('更改分类名称成功');
                this.editCateDialogVisible=false;
                this.getCateList();
            }
            console.log(this.editCateList.editCateName);
            console.log(res)
        },
        async removeUserByID(id){
            console.log(id)
            const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err =>{
            return err
        })

        console.log(confirmResult)
        if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')

        }else{
           const{data:res}= await this.$http.delete('categories/'+id);
           console.log(res)
           if(res.meta.status!==200){
               this.$message.error("删除用户失败");
           }else{
                this.$message.success('删除成功');
                this.getCateList();
           }
           
        }


        },

    }

    }
        
    
    
</script>