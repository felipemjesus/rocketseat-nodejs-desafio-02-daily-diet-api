import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/:userId', async (request, reply) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id: userId }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meals = await knex('meals').where('user_id', userId).select()

    return { meals }
  })

  app.get('/:userId/registered', async (request, reply) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id: userId }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meals = await knex('meals')
      .where('user_id', userId)
      .count('id', { as: 'count' })
      .first()

    return { meals }
  })

  app.get('/:userId/in-diet', async (request, reply) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id: userId }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meals = await knex('meals')
      .where({
        user_id: userId,
        is_diet: true,
      })
      .count('id', { as: 'count' })
      .first()

    return { meals }
  })

  app.get('/:userId/out-diet', async (request, reply) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id: userId }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meals = await knex('meals')
      .where({
        user_id: userId,
        is_diet: false,
      })
      .count('id', { as: 'count' })
      .first()

    return { meals }
  })

  app.get('/:userId/sequence-in-diet', async (request, reply) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id: userId }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meals = await knex('meals')
      .where({
        user_id: userId,
        is_diet: true,
      })
      .count('id', { as: 'count' })
      .first()

    return { meals }
  })

  app.get('/:id/:userId', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    })

    const { id, userId } = getMealParamsSchema.parse(request.params)

    const userExists = await knex('users').where({ id: userId }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meal = await knex('meals')
      .where({
        id,
        user_id: userId,
      })
      .first()

    return { meal }
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.string(),
      is_diet: z.coerce.boolean(),
      user_id: z.string().uuid(),
    })

    const { title, description, date, hour, is_diet, user_id } =
      createMealBodySchema.parse(request.body)

    const userExists = await knex('users').where({ id: user_id }).first()
    if (!userExists) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const meal = await knex('meals')
      .insert({
        title,
        description,
        date,
        hour,
        is_diet,
        user_id,
      })
      .returning('*')

    return reply.status(201).send({ meal: meal[0] })
  })

  app.put('/:id/:userId', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    })

    const { id, userId } = getUserParamsSchema.parse(request.params)

    const mealExists = await knex('meals')
      .where({ id, user_id: userId })
      .first()
    if (!mealExists) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.string(),
      is_diet: z.coerce.boolean(),
    })

    const { title, description, date, hour, is_diet } =
      createMealBodySchema.parse(request.body)

    const meal = await knex('meals')
      .update({
        title,
        description,
        date,
        hour,
        is_diet,
        updated_at: knex.fn.now(),
      })
      .where({
        id,
        user_id: userId,
      })
      .returning('*')

    return reply.status(201).send({ meal: meal[0] })
  })

  app.delete('/:id/:userId', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    })

    const { id, userId } = getUserParamsSchema.parse(request.params)

    const mealExists = await knex('meals')
      .where({ id, user_id: userId })
      .first()
    if (!mealExists) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    await knex('meals').delete().where({
      id,
      user_id: userId,
    })

    return reply.status(204).send()
  })
}
