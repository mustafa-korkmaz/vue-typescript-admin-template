import httpService from '@/utils/request'
import { IPagedListQuery, IApiResponse, IPagedList } from '../types'
import { IUser } from './types'

export default class UserService {
  getUsers(params: IPagedListQuery) {
    return httpService.request<IPagedListQuery, IApiResponse<IPagedList<IUser>>>({
      url: 'users',
      params,
      method: 'get'
    })
  }
}
