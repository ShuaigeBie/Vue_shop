<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>

    <el-card class="box-card"> 
        <el-row :gutter="50">
           
                 <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>                 
                    </el-input>
                </el-col>
            <el-col :span="4">  
                 <el-button type="primary" plain @click="dialogVisible=true">添加用户</el-button>
             </el-col>      
       
        </el-row>

        <el-table :data="userlist" stripe>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" >
                <template slot-scope="scope">
                
                        <el-switch v-model="scope.row.mg_state" @change='userStateChanged(scope.row)'></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250px" >
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click='showEditDialog(scope.row.id)'></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click='removeUserByID(scope.row.id)'></el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--底部分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 4,5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
         </el-pagination>


          </el-card>
          <!--添加用户对话框-->
          <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addDialogClosed">
                <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="70px"  >
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>    
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
          </el-dialog>

          <!--修改用户对话框-->
            <el-dialog
            title="提示"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
            <el-form :model="editForm" :rules="addFormRule" ref="editFormRef" label-width="70px"  >
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
            </el-dialog> 


            <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="30%"
            @close='setRoleDialogColsed'>
            <div>
                <p>当前用户:{{userInfo.username}}</p>
                <p>当前角色:{{userInfo.role_name}}</p>
                <p>分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
            </el-dialog>
             
           
       
    
    
    
    
    
    
    </div>
</template>

<script>
export default {
    data(){
        var checkEmail=(rule,value,cb)=>{
            console.log("aaaa");
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(regEmail.test(value)){
          return cb()
      }
      cb(new Error('请输入合法的邮箱'))
      };

        var checkMobile=(rule,value,cb)=>{
            const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if(regMobile.test(value)){
          return cb()
      }
      cb(new Error('请输入合法的手机号'))
      }


        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:4

            },
            userlist:[],
            total:0,
            dialogVisible:false,
            editDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                moible:''
            },
            addFormRule:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    {min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:6,max:15,message:'密码的长度在6~15个字符之间',trigger:'blur'}
                ], 
                email:[
                    {required:true,message:'请输入邮箱',trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required:true,message:'请输入手机号',trigger:'blur'},
                    {validator:checkMobile,trigger:'blur'}
                ]
            },
            editForm:{},
            setRoleDialogVisible:false,
            userInfo:'',
            roleList:[],
            selectedRoleId:[],

        }
    },
    created(){
        this.getUserList();

    },
    methods:{
        async getUserList(){
         const{ data:res} = await this.$http.get('users',{params: this.queryInfo

            })
            if(res.meta.status !==200){
                return this.$message.error('获取用户列表失败！')
            }else{
                this.userlist=res.data.users;
                this.total=res.data.total;
            }
            console.log(res)
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getUserList();
        },
        async userStateChanged(userinfo){
            console.log(userinfo)
            const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            console.log(res)
            if(res.meta.status!==200){
                userinfo.mg_state = ! userinfo.mg_state
                return this.$message.error('更新用户状态失败')}else{
                    this.$message.success('更新用户状态成功')
                }
            },
            addDialogClosed(){
                console.log("aaa");
                this.$refs.addFormRef.resetFields();
            },
            addUser(){
                this.$refs.addFormRef.validate(async valid =>{
                    console.log(valid);
                    if(!valid){
                        return
                    }else{
                      const {data:res}= await  this.$http.post('users',this.addForm);
                      if(res.meta.status !== 201){
                          this.$message.error('添加用户失败')}
                          else{
                              this.$message.success('添加用户成功');
                              this.dialogVisible = false;
                              this.getUserList();
                          }
                      }
                    
                })
            },
        async showEditDialog(id){
            console.log(id);
            
            const{data:res}=await this.$http.get('users/'+id);
            if(res.meta.status!==200){
                return this.$message.error('查询用户信息失败')
            }else{
                this.editDialogVisible=! this.editDialogVisible;
                this.editForm=res.data;
                console.log(this.editForm)
            }
        },
        editDialogClose(){
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid){
                    return
                }else{
                  const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })
                    if(res.meta.status!==200){
                        return this.$message.error('更新用户信息失败')
                    }else{
                        this.editDialogVisible=false;
                        this.getUserList();
                        this.$message.success('更新用户信息成功');
                    }
                }
            })
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
           const{data:res}= await this.$http.delete('users/'+id);
           console.log(res)
           if(res.meta.status!==200){
               this.$message.error("删除用户失败");
           }else{
                this.$message.success('删除成功');
                this.getUserList();
           }
           
        }


        },
        async setRole(userInfo){
            
            this.userInfo = userInfo;

            const {data:res} = await this.$http.get('roles');
            if(res.meta.status!=200){
                return this.$message.error('获取角色列表失败!')
            }else{
                this.roleList=res.data;
                this.setRoleDialogVisible=true;
            }
        },
        async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选择要分配的角色')
            }else{
                const{data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});
                console.log(res)
                if(res.meta.status!==200){
                    return this.$message.error('更新角色失败!')
                }else{
                    this.$message.success('更新角色成功');
                    this.getUserList();
                    this.setRoleDialogVisible=false;
                }
            }
        },
        setRoleDialogColsed(){
            this.selectedRoleId='';
            this.userInfo={};
        },
        text(){
            console.log('这是一个方法')
        }

        }
       
    }

</script>

<style lang="less" scope>

    
   
    .el-table{
        margin-top: 15px;
        font-size: 12px;
        
    }
   
     
        
    
</style>