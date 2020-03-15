import Vue from 'vue'
import { Button, Card } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Icon } from 'element-ui'
import { Container,Header,main,aside,Menu,Submenu,MenuItem,MenuItemGroup,Breadcrumb,BreadcrumbItem,Col,Row,Table,
    TableColumn,Switch,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,CheckboxGroup,
Upload,Timeline,TimelineItem} from 'element-ui'

import { Message} from 'element-ui'


Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(main)
Vue.use(aside)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

Vue.prototype.$message = Message
Vue.prototype.$confirm=MessageBox.confirm