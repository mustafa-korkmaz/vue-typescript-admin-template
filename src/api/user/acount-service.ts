import httpService from '@/utils/http'
import { IApiResponse } from '../types'
import { IUser } from './types'

export function getAccount() {
  return httpService.request<any, IApiResponse<IUser>>({
    url: 'account',
    method: 'get'
  })
}

export function login(email: string, password: string) {
  const data = {
    email_or_username: email,
    password
  }

  return httpService.request<any, IApiResponse<IUser>>({
    url: `account/token`,
    data,
    method: 'post'
  })
}

export function register(email: string, name: string, password: string) {
  const data = {
    email,
    username: email,
    password,
    name_surname: name
  }

  return httpService.request<any, IApiResponse<IUser>>({
    url: `account/register`,
    data,
    method: 'post'
  })
}

// todo: add forgot password logic
export function remindPassword(email: string) {
  const data = {
    email_or_username: email
  }

  return httpService.request<any, IApiResponse<any>>({
    url: `account/TODO`,
    data,
    method: 'post'
  })
}