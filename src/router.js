import Vue from 'vue'
import Router from 'vue-router'
import Register from './components/Register'
import PageNotFound from './Views/NotFoundPage'
import Login from './Views/Login'
import UserPage from './components/UserPage'
import UserSettingsPage from './components/UserSettingsPage'
import MyGoodsPage from "@/Views/MyGoodsPage";
import GoodPage from "@/Views/GoodPage";

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/register',
            component: Register,
            name: "RegisterPage"
        },
        {
            path: '/login',
            component: Login,
            name: "LoginPage"
        },
        {
            path: '/user/:pk',
            component: UserPage,
            name: "UserPage"
        },
        {
            path: '/settings',
            component: UserSettingsPage,
            name: "User settings"
        },
        {
            path: '/my-goods',
            component: MyGoodsPage,
            name: "MyGoodsPage"
        },
        {
            path: '/good/:pk/:action',
            component: GoodPage,
            name: "GoodPageAction"
        },
        {
            path: '/good/:pk',
            component: GoodPage,
            name: "GoodPage"
        },
        {
            path: '/:pathMatch(.*)*',
            component: PageNotFound,
            name: "PageNotFound"
        },
    ]
})