<template>
    <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList()">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click='goAddpage'>添加商品</el-button>
                </el-col>
            </el-row>

            <el-table :data="goodList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label='商品名称' prop="goods_name"></el-table-column>
                <el-table-column label='商品价格(元)' prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label='创建时间' prop="add_time">
                    <template slot-scope="scope">
                        <div>
                             {{scope.row.add_time | dateFormat}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
                            
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click=removeById(scope.row.goods_id)></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>


                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>

    </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodList:[],
            total:0,
        }
    },
    created(){
        this.getGoodList();
    },
    methods: {
        async getGoodList(){
            const{data:res} = await this.$http.get('goods',{params:this.queryInfo});
            if(res.meta.status!==200){
                return this.$message.error('获取商品列表失败')
            }else{
                this.$message.success('获取商品列表成功');
                this.goodList=res.data.goods;
                this.total=res.data.total;
                console.log(res.data)
            }
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize;
            this.getGoodList();
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage;
            this.getGoodList();
        },
        async removeById(id){
            const confirmResult =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err);

        if(confirmResult !=='confirm'){
            return this.$message.info('已取消删除!')
        }else{
            const{data:res} = await this.$http.delete('goods/'+id);
            if(res.meta.status!==200){
                return this.$message.error('删除失败')
            }else{
                this.$message.success('删除成功')
                this.getGoodList();
            }
        }
        },
        goAddpage(){
            this.$router.push('/goods/add')
        },
    },
    
}
</script>