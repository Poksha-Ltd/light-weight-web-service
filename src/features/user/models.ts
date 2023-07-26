
const USER_ROLES = ['ADMIN'] as const
export type UserRole = typeof USER_ROLES[number]
export type User = {
  id: string
  name: string | null
  email: string | null
  roles: UserRole[]
}


export const newUserRole = (v: string): UserRole | null => {
  if (USER_ROLES.includes(v as UserRole)) {
    return v as UserRole
  }
  return null
}