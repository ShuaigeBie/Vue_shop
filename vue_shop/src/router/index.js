import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/user.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import AddPage from '../components/goods/add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login', component:Login },
    {path:'/home', 
    component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params', component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:AddPage},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report}
    ]},
    
  ]
})
router.beforeEach((to,from,next) => {
    if(to.path === '/login'){
      return next();
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr){
      return next ('/login')
    }else{
      next();
    }
})
export default router
