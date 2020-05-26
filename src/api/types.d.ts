import { ResponseCode } from '@/utils/enums'

export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface IPagedListQuery {
  offset: number
  limit: number
  include_records_total: boolean
  sort_by: string | null
  sort_type: string | null
}

export interface IApiResponse<T> {
  response_code: ResponseCode
  error_code: string
  type_text: string
  data: T
}

export interface IPagedList<T> {
  items: T[]
  records_total: number
}
