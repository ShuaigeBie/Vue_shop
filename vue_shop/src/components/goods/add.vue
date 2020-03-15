<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false">
            </el-alert>

            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>


        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <!-- tab栏区 -->
            <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave='beforeTabLeave' @tab-click='tabClicked'>
                <el-tab-pane label="基本信息" name='0'>
                    <el-form-item label="商品名称" prop='goods_name'>
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop='goods_price'>
                        <el-input v-model="addForm.goods_price" type='number'></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop='goods_weight'>
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop='goods_number'>
                        <el-input v-model="addForm.goods_number" type='number'></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader
                        v-model="addForm.goods_cat"
                        :options="catelist"
                        :props="cateProps"
                        @change="handleChange"
                        expandTrigger='hover'>
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name='1'>
                    <el-form-item :label='item.attr_name' v-for='item in manyTableData' :key='item.attr_id'>
                        <el-checkbox-group v-model="item.attr_vals" >
                            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                        
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name='2'>
                    <el-form-item :label='item.attr_name' v-for='item in onlyTableData' :key='item.attr_id'>
                        <el-input v-model='item.attr_vals'></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name='3'>
                    <!-- action表示图片要上传的地址 -->
                    <el-upload
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="hedaerObj"
                        :on-success="handleSuccess"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name='4'>
                    <!-- 富文本编辑器 -->
                    <quill-editor v-model="addForm.gooods_introduce"></quill-editor>
                    <el-button type="primary" class="btn" @click="add">添加商品</el-button>
                </el-tab-pane>
                
            </el-tabs>
        </el-form>
        </el-card>

    <!-- 图片预览 -->
    <el-dialog
        title="提示"
        :visible.sync="preViewVisible"
        width="50%">
        <img :src="preViewPath" class='preViewImg'>
    </el-dialog>   

    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            activeIndex:0,
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                pic:[],
                attrs:[],
                //商品所属的分类数组
                goods_cat:[],
                gooods_introduce:''
            },
            addFormRules:{
                goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
                goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
                goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
                goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
                goods_cat:[{required:true,message:'请选中商品分类',trigger:'blur'}],
            },
            catelist:[],
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            //动态参数列表参数
            manyTableData:[],
            onlyTableData:[],
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            //图片上传的请求头对象
            hedaerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            preViewPath:'',
           preViewVisible:false,



        }
    },
    created(){
        this.getCateList();
    },
    methods: {
        async getCateList(){
            const{data:res} = await this.$http.get('categories');
            if(res.meta.status!==200){
                return this.$message.error('获取商品分类失败')
            }else{
                this.catelist=res.data;
                console.log(this.catelist)
            }
        },
        handleChange(){
            console.log(this.addForm.goods_cat)
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[]
            }
        },
        beforeTabLeave(activeName,oldActiveNave){
            console.log('从'+oldActiveNave+'===>'+activeName)
            if(oldActiveNave==='0'&&this.addForm.goods_cat.length!==3){
                this.$message.error('请先选择分类')
                return false
            }
        },
        async tabClicked(){
            console.log(this.activeIndex)
            if(this.activeIndex ==='1'){
                console.log('动态参数面板')
            const{data:res} = await  this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}});
            if(res.meta.status!==200){
                return this.$message.error('获取动态参数列表失败')
            }else{
                console.log(res.data);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
                })
                this.manyTableData=res.data;
            }
            }else if(this.activeIndex ==='2'){
               const{data:res} = await  this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}});
                if(res.meta.status!==200){
                    return this.$message.error('获取静态属性失败')
                }else{
                    this.onlyTableData=res.data;
                }
            }
        },
        //处理图片预览效果
        handlePreview(file){
            console.log(file);
            this.preViewPath=file.response.data.url;
            this.preViewVisible=true

        },
        //移除图片操作
        handleRemove(file){
            console.log(file)
            const filePath= file.response.data.tmp_path;
            const i = this.addForm.pic.findIndex(x => x.pic === filePath)
            this.addForm.pic.splice(i,1)
            console.log(this.addForm)
        },
        //图片上传成功的钩子
        handleSuccess(response){
            console.log(response)
            const picInfo = {pic:response.data.tmp_path};
            this.addForm.pic.push(picInfo);
            console.log(this.addForm)
        },
        add(){
            this.$refs.addFormRef.validate(
                async valid =>{
                    if(!valid){
                        return this.$message.error('请填写必要的表单项')
                    }else{
                       const form = _.cloneDeep(this.addForm)
                        form.goods_cat=form.goods_cat.join(',')
                        //处理动态参数
                        this.manyTableData.forEach(item =>{
                            const newInfo = {attr_id : item.attr_id , attr_vals : item.attr_vals};
                            this.addForm.attrs.push(newInfo)
                        })
                        this.onlyTableData.forEach(item =>{
                            const newInfo = {attr_id : item.attr_id , attr_vals : item.attr_vals};
                            this.addForm.attrs.push(newInfo)
                        })
                        form.attrs=this.addForm.attrs;
                        console.log(form);

                        const{data:res} = await this.$http.post('goods',form);
                        if(res.meta.status!==201){
                            return this.$message.error('添加商品失败')
                        }else{
                            this.$message.success('添加商品成功')
                            this.$router.push('/goods')
                        }
                    }
                }
            )
        }





    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }else{
                return null
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .preViewImg{
        width: 100%;
    }
    .btn{
        margin-top: 10px
    }
    

</style>