import httpService from '@/utils/request'
import { IPagedListQuery, IApiResponse, IPagedList } from '../types'
import { IUser } from './types'

export default class UserService {
  getHeadlines(params: IPagedListQuery) {
    return httpService.request<IPagedListQuery, IApiResponse<IPagedList<IUser>>>({
      url: 'user',
      params,
      method: 'get'
    })
  }
}