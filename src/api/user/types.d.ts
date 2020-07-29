export interface IUser {
    name_surname: string
    id: string
    username: string
    email: string
    access_token: string
    roles: string[]
    settings: IUserSettings
    title: string
    created_at: Date
    membership_expires_at: Date
}

export interface IUserSettings {
    fixed_header: boolean
    open_tags_view: boolean
    theme_color: string
    pagination_align: string
}