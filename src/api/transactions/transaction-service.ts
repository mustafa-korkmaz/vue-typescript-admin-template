import httpService from '@/utils/http'
import { IApiResponse, IPagedList } from '../types'
import { ITransaction, ITransactionQuery } from './types'
import { defaultParameter } from '../parameters/parameter-service'
import { defaultCustomer } from '../customers/customer-service'

export const defaultTransaction: ITransaction = {
  id: 0,
  description: '',
  amount: 0,
  type: defaultParameter,
  customer: defaultCustomer,
  is_debt: null,
  date_text: null,
  created_at_text: null,
  modified_at_text: null
}

export const defaultTransactionQuery: ITransactionQuery = {
  offset: 0,
  limit: 10,
  customer_id: null,
  type_id: null,
  is_debt: null,
  include_records_total: true,
  sort_by: null,
  sort_type: null
}

export function getTransactions(params: ITransactionQuery) {
  return httpService.request<ITransactionQuery, IApiResponse<IPagedList<ITransaction>>>({
    url: 'transactions',
    params,
    method: 'get'
  })
}

export function createTransaction(txn: ITransaction) {
  const data = {
    customer_id: txn.customer.id,
    type_id: txn.type.id,
    amount: txn.amount,
    description: txn.description,
    date_ext: txn.date_text
  }
  return httpService.request<any, IApiResponse<number>>({
    url: 'transactions',
    data,
    method: 'post'
  })
}

export function updateTransaction(txn: ITransaction) {
  const data = {
    type_id: txn.type.id,
    amount: txn.amount,
    description: txn.description,
    date_ext: txn.date_text
  }
  return httpService.request<any, IApiResponse<any>>({
    url: `transactions/${txn.id}`,
    data,
    method: 'put'
  })
}

export function deleteTransaction(id: number) {
  return httpService.request<any, IApiResponse<any>>({
    url: `transactions/${id}`,
    method: 'delete'
  })
}
