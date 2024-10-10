import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  const preHandler = { preHandler: [] }

  app.get('/', preHandler, async (request) => {
    const { userId } = request.headers

    const meals = await knex('meals').where('user_id', userId).select()

    return { meals }
  })

  app.get('/:id', preHandler, async (request) => {
    const { userId } = request.headers

    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id,
        user_id: userId,
      })
      .first()

    return { meal }
  })

  app.post('/', async (request, reply) => {
    const { userId } = request.headers

    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.number(),
      date: z.string(),
      hour: z.string(),
      is_diet: z.coerce.boolean(),
    })

    const { title, description, date, hour, is_diet } =
      createMealBodySchema.parse(request.body)

    await knex('meals')
      .insert({
        id: crypto.randomUUID(),
        title,
        description,
        date,
        hour,
        is_diet,
        user_id: userId,
      })
      .returning('*')

    return reply.status(201).send()
  })
}
