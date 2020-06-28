import httpService from '@/utils/http'
import { IApiResponse } from '../types'
import { IUser, IUserSettings } from './types'

export function getAccount() {
  return httpService.request<any, IApiResponse<IUser>>({
    url: 'account',
    method: 'get'
  })
}

export function getDemoAccount(language: string, password: string) {
  const data = {
    language,
    password
  }

  return httpService.request<any, IApiResponse<string>>({
    url: 'account/demo',
    data,
    method: 'post'
  })
}

export function updateSettings(userSettings: IUserSettings) {
  const data = {
    fixed_header: userSettings.fixed_header,
    open_tags_view: userSettings.open_tags_view,
    theme_color: userSettings.theme_color,
    pagination_align: userSettings.pagination_align
  }

  return httpService.request<any, IApiResponse<any>>({
    url: 'account/settings',
    data,
    method: 'post'
  })
}

export function login(email: string, password: string) {
  const data = {
    email_or_username: email,
    password
  }

  return httpService.request<any, IApiResponse<IUser>>({
    url: 'account/token',
    data,
    method: 'post'
  })
}

export function register(email: string, password: string, language: string) {
  const data = {
    email,
    language,
    password
  }

  return httpService.request<any, IApiResponse<any>>({
    url: 'account/register',
    data,
    method: 'post'
  })
}

export function resetPassword(email: string) {
  const data = {
    email_or_username: email
  }

  return httpService.request<any, IApiResponse<any>>({
    url: 'account/reset',
    data,
    method: 'post'
  })
}
