import httpService from '@/utils/request'
import { IPagedListQuery, IApiResponse, IPagedList } from '../types'
import { ICustomer } from './types'

export const defaultCustomer: ICustomer = {
  id: 0,
  authorized_person_name: '',
  title: ''
}