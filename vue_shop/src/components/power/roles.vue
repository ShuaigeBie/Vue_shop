<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type='primary' @click="dialogVisible=true" >添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data='rolelist' border stripe>

                <el-table-column type="expand">
                   <template slot-scope="scope">
            <el-row :class="['bdbuttom',i1 === 0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close='removeRightById(scope.row,item1.id)'  closable>{{item1.authName}}</el-tag>
              </el-col>

              <el-col :span='19'>
                  <el-row :class="[i2===0?'':'bdtop']"  v-for="(item2,i2) in item1.children" :key='item2.id'>
                      <el-col :span='6'><el-tag type='success' @close='removeRightById(scope.row,item2.id)'  closable>{{item2.authName}}</el-tag></el-col>
                      <el-col :span='18'>
                          
                              <el-tag type="warning" @close='removeRightById(scope.row,item3.id)'  closable v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                          
                      </el-col>
                  </el-row>
              </el-col>
            
            </el-row>

            <pre>
              {{scope.row.id}}
            </pre>
          </template>
                </el-table-column>


                <el-table-column type='index'></el-table-column>
                <el-table-column label='角色名' prop='roleName'></el-table-column>
                <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
                <el-table-column label='操作' width="400px" >
                   <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="shouEditRoles(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleInfo(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click='showSetRightDialog(scope.row)'>分配权限</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-card>


        
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
                @close="RoleDialogClosed">
                <el-form :model="addRolesList" ref="addFormRef" label-width="80px"  >
                    <el-form-item label="角色名称" prop="roleName" >
                        <el-input v-model="addRolesList.roleName"></el-input>
                    </el-form-item>    
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRolesList.roleDesc"></el-input>    
                    </el-form-item>    
                </el-form>    
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRoles">确 定</el-button>
                </span>
          </el-dialog>


          <el-dialog
            title="提示"
            :visible.sync="editRoleDialogVisible"
            width="50%"
            @close="editRoleDialogClose">
            <el-form :model="editRoleForm" ref="editRoleRef" label-width="80px" >
                    <el-form-item label="ID">
                        <el-input v-model="editRoleForm.roleId" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesInfo(editRoleForm.roleId)" >确 定</el-button>
            </span>
            </el-dialog> 


            <el-dialog
            title="提示"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close='SetRightDialogClosed'
            >
            
            <el-tree :data='rightslist' :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="allotRights">确 定</el-button>
            </span>
            </el-dialog> 
          
    </div>
</template>

<script>
export default {
    data(){
        return{
            rolelist:[],
            dialogVisible:false,
            editRoleDialogVisible:false,
            setRoleDialogVisible:false,
            addRolesList:{
                roleName:'',
                roleDesc:''
            },
            editRoleForm:{},
            rightslist:[],
            treeProps:{
                label:'authName',
                children:'children'
            },
            defKeys:[],
            roleId:''

        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const{data:res}=await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取角色列表失败')
            }else{
                this.rolelist=res.data;
            }
            console.log(this.rolelist)
        },
        RoleDialogClosed(){
                console.log("aaa");
                this.$refs.addFormRef.resetFields();
            },
        async addRoles(){
            console.log('aaa');
            const{data:res}=await this.$http.post('roles',this.addRolesList);
            console.log(res)
            if(res.meta.status!==201){
                this.$message.error('添加角色失败')
            }else{
                this.$message.success('添加角色成功');
                this.dialogVisible=false;
                this.getRolesList();
            }
        },
        editRoleDialogClose(){
            this.$refs.editRoleRef.resetFields();
        },
        async shouEditRoles(id){
            this.editRoleDialogVisible=true;
            const{data:res} = await this.$http.get('roles/'+id);
            if(res.meta.status!=200){
                return this.$$message.error(获取用户信息失败);
            }else{
                this.editRoleForm=res.data;
            }
            console.log(res.data)
            console.log(this.editRoleForm)
        },
        async editRolesInfo(id){
            const{data:res}=await this.$http.put('roles/'+id,this.editRoleForm);
            if(res.meta.status!==200){
                return this.$message.error('修改角色失败');
                
            }else{
                this.$message.success('修改角色成功');
                this.editRoleDialogVisible=false;
                this.getRolesList();
            }
            console.log(res)
        },
        async deleteRoleInfo(id){
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
           const{data:res}=await this.$http.delete('roles/'+id);
           console.log(res)
           if(res.meta.status!==200){
               this.$message.error("删除用户失败");
           }else{
                this.$message.success('删除成功');
                this.getRolesList();
           }
           
        }


        },
        async removeRightById(role,id){
            const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err =>{
            return err
        })
            console.log(id)
            if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')

        }else{
            console.log(role,id)
           const{data:res}=await this.$http.delete('roles/'+ role.id +'/rights/'+id);
           console.log(res)
           if(res.meta.status!==200){
               this.$message.error("删除用户失败");
           }else{
                this.$message.success('删除成功');
                
                
           }
           role.children=res.data;
           
        }
        

        },
        async showSetRightDialog(role){
            this.roleId=role.id;
            const {data:res} =await this.$http.get('rights/tree')
            if(res.meta.status!==200){
                return this.$message.error('获取权限数据失败')
            }else{
                this.rightslist=res.data;
                this.getLeafKeys(role,this.defKeys);
                this.setRoleDialogVisible=true;
                console.log(role)

                

            }
        },
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id);
            }else{
                node.children.forEach(item =>{
                    this.getLeafKeys(item,arr)
                })
            }
        },
        SetRightDialogClosed(){
            this.defKeys=[]
        },
        async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
        const idStr = keys.join(',');
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
        console.log(res)
        if(res.meta.status !==200){
            return this.$message.error('分配权限失败')
        }else{
            this.$message.success('分配权限成功');
            this.getRolesList();
            this.setRoleDialogVisible=false;
        }
    
        }
        
        }
    
}
</script>

<style lang="less" scope>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbuttom{
    border-bottom: 1px solid #eee;
}
.vermidd{
    display: flex;
    align-items: center
}    
</style>