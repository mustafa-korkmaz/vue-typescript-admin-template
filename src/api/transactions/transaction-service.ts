import httpService from '@/utils/http'
import { IApiResponse, IPagedList } from '../types'
import { ITransactionAttachment, ITransaction, ITransactionQuery } from './types'
import { defaultParameter } from '../parameters/parameter-service'
import { defaultCustomer } from '../customers/customer-service'

export const defaultTransaction: ITransaction = {
  id: 0,
  description: null,
  attachment_name: null,
  amount: null,
  type: defaultParameter,
  type_id: null,
  customer: defaultCustomer,
  customer_id: null,
  is_debt: null,
  date: null,
  date_text: null,
  created_at: null,
  modified_at: null
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

export const defaultTransactionAttachment: ITransactionAttachment = {
  name: null,
  file: null
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
    customer_id: txn.customer_id,
    type_id: txn.type_id,
    amount: txn.amount,
    description: txn.description,
    attachment_name: txn.attachment_name,
    date_text: txn.date_text
  }
  return httpService.request<any, IApiResponse<number>>({
    url: 'transactions',
    data,
    method: 'post'
  })
}

export function updateTransaction(txn: ITransaction) {
  const data = {
    type_id: txn.type_id,
    amount: txn.amount,
    description: txn.description,
    attachment_name: txn.attachment_name,
    date_text: txn.date_text
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

export function downloadAttachment(name: string) {
  return httpService.request<any, any>({
    url: `uploads/${name}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function uploadAttachment(file: File) {
  const formData = new FormData()

  formData.append('file', file, file.name)
  return httpService.post<any, IApiResponse<string>>('uploads', formData)
}
