import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const settingsRouter: RouteConfig = {
  path: '/settings',
  component: Layout,
  redirect: '/settings',
  meta: {
    title: 'settings',
    icon: 'settings2',
    alwaysShow: true
  },
  children: [
    {
      path: 'transaction-types',
      component: () => import(/* webpackChunkName: "settings-transaction-types" */ '@/views/settings/transaction-types.vue'),
      name: 'TransactionTypes',
      meta: {
        title: 'transactionTypes',
        tooltip: 'transactionTypesTooltip'
      }
    },
    {
      path: 'theme-preferences',
      component: () => import(/* webpackChunkName: "settings-theme-preferences" */ '@/views/settings/theme-preferences.vue'),
      name: 'ThemePreferences',
      meta: {
        title: 'themePreferences'
      }
    }
  ]
}

export default settingsRouter
