<template>
    <div class="main">
        
           <el-container class="home-container">
                <el-header><h2 style="color:white">电商后台管理系统</h2>
                     <el-button type="info" @click='logout'>退出</el-button>
                </el-header>
                <el-container>
                    <el-aside :width="isCollapse?'64px':'200px'">
                        <div class="collapse" @click="changeWidth">|||</div>

    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition='false'
      :router="true"
      :default-active="'/'+activePath">

      <el-submenu :index="item.id+''" v-for="item in menuList" :key='item.id' >
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>{{item.authName}}</span>
          <!-- {{itema.bbc}}
          {{iconID[2]}} -->
        </template> 
        <!--二级菜单-->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key='subItem.id' @click="getActivePath(subItem.path)">
          <i class="el-icon-location"></i>
          <span>{{subItem.authName}}</span>
        </el-menu-item>
      </el-submenu>

      
     


    </el-menu>

                    </el-aside>
                    <el-main>
                         <router-view></router-view>
                    </el-main>
                   
                </el-container>
            </el-container>
    </div>
  

</template>
<script>
export default {
    data(){
        return{
            menuList:[],
            itema:{
                'bbc':"a"
            },
            iconID:{
                '2':"el-icon-user"
            },
            isCollapse:true,
            activePath:'',
           
        }
    },
    created(){
        this.getMenuList();
        this.activePath=window.sessionStorage.getItem('activePath');
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        async getMenuList(){
            const {data:res} = await this.$http.get('menus');
            if(res.meta.status !==200){
                return this.$message.error(res.meta.msg)
            }else{
                this.menuList=res.data;
            }
            // console.log(res);
        },
        changeWidth(){
            this.isCollapse =!this.isCollapse;
        },
        getActivePath(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath;
        }

    }
}
</script>

<style lang="less" scope>
    .home-container,.main{
    height: 100%
    }
    .el-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background:#545C64
    }
    .el-aside{
        background: #545C64;
        .el-menu{
            border: none;
        }
        .collapse{
            background: #545C64;
            text-align: center;
            letter-spacing: 2px;
            cursor: pointer;
            color: white;
        }
    }
    .el-main{
        background: #EAEDF2
    }
</style>