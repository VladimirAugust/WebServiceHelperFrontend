import Vue from 'vue'
import Router from 'vue-router'
import Register from './components/Register'
import PageNotFound from './Views/NotFoundPage'
import Login from './Views/Login'
import UserPage from './components/UserPage'
import UserSettingsPage from './components/UserSettingsPage'

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
            path: '/:pathMatch(.*)*',
            component: PageNotFound,
            name: "PageNotFound"
        },
    ]
})