export type Need = {
  full_name: true
  password: true
}

export type User = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  has_password: boolean
  needs?: Need
}
