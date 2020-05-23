import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const settingsRouter: RouteConfig = {
  path: '/settings',
  component: Layout,
  redirect: '/settings',
  meta: {
    title: 'settings',
    icon: 'settings',
    alwaysShow: true
  },
  children: [
    {
      path: 'transaction-types',
      component: () => import(/* webpackChunkName: "settings-transaction-types" */ '@/views/settings/transaction-types.vue'),
      name: 'TransactionTypes',
      meta: {
        title: 'transactionTypes',
      }
    }
  ]
}

export default settingsRouter
