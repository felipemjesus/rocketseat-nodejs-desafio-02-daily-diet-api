import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()
    return { users }
  })

  app.get('/:id', async (request) => {
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

    const user = await knex('users')
      .insert({
        name,
        email,
      })
      .returning('*')

    return reply.status(201).send({ user: user[0] })
  })

  app.put('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const user = await knex('users')
      .update({
        name,
        email,
        updated_at: knex.fn.now(),
      })
      .where({ id })
      .returning('*')

    return reply.status(201).send({ user: user[0] })
  })

  app.delete('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    await knex('users').delete().where({ id })

    return reply.status(204).send()
  })
}
