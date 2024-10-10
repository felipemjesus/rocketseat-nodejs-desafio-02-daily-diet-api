// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      title: string
      description: number
      date: string
      hour: string
      is_diet: boolean
      user_id: string
      created_at: string
    }
    users: {
      id: string
      name: string
      email: string
      created_at: string
    }
  }
}
