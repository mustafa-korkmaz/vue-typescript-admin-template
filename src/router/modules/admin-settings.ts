import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const adminSettingsRouter: RouteConfig = {
  path: '/admin-settings',
  component: Layout,
  redirect: '/admin-settings/directive',
  meta: {
    title: 'adminSettings',
    icon: 'lock',
    roles: ['admin'], // you can set roles in root nav
    alwaysShow: false
  },
  children: [
    {
      path: 'page',
      component: () => import(/* webpackChunkName: "admin-settings-page" */ '@/views/admin-settings/page.vue'),
      name: 'AdminPagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'directive',
      component: () => import(/* webpackChunkName: "admin-settings-directive" */ '@/views/admin-settings/directive.vue'),
      name: 'AdminDirectivePermission',
      meta: {
        title: 'directivePermission',
        roles: ['admin'] // if do not set roles, means: this page does not require permission
      }
    },
    {
      path: 'role',
      component: () => import(/* webpackChunkName: "admin-settings-role" */ '@/views/admin-settings/role.vue'),
      name: 'AdminRolePermission',
      meta: {
        title: 'rolePermission',
        roles: ['admin']
      }
    }
  ]
}

export default adminSettingsRouter
