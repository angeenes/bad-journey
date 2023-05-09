  export interface UserInterface {
    jwt: string
    user: IUser
  }
  
  export interface IUser {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string,
    avatar?: Avatar
  }

  export interface Avatar {
    formats: Formats
  }
  
  export interface Formats {
    thumbnail: Thumbnail
    large: Large
    small: Small
    medium: Medium
  }
  
  export interface Thumbnail {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
  }
  
  export interface Large {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
  }
  
  export interface Small {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
  }
  
  export interface Medium {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
  }
  