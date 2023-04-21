  export interface UserObject {
    jwt: string
    user: User
  }
  
  export interface User {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }
  