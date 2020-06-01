import httpService from '@/utils/http'
import { IApiResponse, IPagedList } from '../types'
import { ICustomer, ICustomerQuery } from './types'

export const defaultCustomer: ICustomer = {
  id: null,
  authorized_person_name: '',
  title: '',
  phone_number: '',
  created_at: null,
  remaining_balance: 0,
  receivable_balance: 0,
  debt_balance: 0,
  receivables_amount: 0,
  debts_amount: 0
}

export const defaultCustomerQuery: ICustomerQuery = {
  offset: 0,
  limit: 10,
  title: null,
  authorized_person_name: null,
  include_records_total: true,
  sort_by: null,
  sort_type: null
}

export function getCustomers(params: ICustomerQuery) {
  return httpService.request<ICustomerQuery, IApiResponse<IPagedList<ICustomer>>>({
    url: 'customers',
    params,
    method: 'get'
  })
}

export function createCustomer(customer: ICustomer) {
  const data = {
    title: customer.title,
    authorized_person_name: customer.authorized_person_name === '' ? null : customer.authorized_person_name,
    phone_number: customer.phone_number === '' ? null : customer.phone_number
  }
  return httpService.request<any, IApiResponse<number>>({
    url: 'customers',
    data,
    method: 'post'
  })
}

export function updateCustomer(customer: ICustomer) {
  const data = {
    title: customer.title,
    authorized_person_name: customer.authorized_person_name === '' ? null : customer.authorized_person_name,
    phone_number: customer.phone_number === '' ? null : customer.phone_number
  }
  return httpService.request<any, IApiResponse<any>>({
    url: `customers/${customer.id}`,
    data,
    method: 'put'
  })
}

export function deleteCustomer(id: number) {
  return httpService.request<any, IApiResponse<any>>({
    url: `customers/${id}`,
    method: 'delete'
  })
}
