import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  const preHandler = { preHandler: [] }

  app.get('/', preHandler, async (request) => {
    const users = await knex('users').select()

    return { users }
  })

  app.get('/:id', preHandler, async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user = await knex('users').where({ id }).first()

    return { user }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    await knex('users')
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
      })
      .returning('*')

    return reply.status(201).send()
  })
}
