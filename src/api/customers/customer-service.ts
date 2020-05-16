import httpService from '@/utils/http'
import { IApiResponse, IPagedList } from '../types'
import { ICustomer, ICustomerQuery } from './types'

export const defaultCustomer: ICustomer = {
  id: 0,
  authorized_person_name: '',
  title: '',
  phone_number: '',
  created_at_text: '',
  remaining_balance: 0,
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