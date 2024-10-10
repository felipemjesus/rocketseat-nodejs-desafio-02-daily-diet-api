import { describe, it, beforeAll, afterAll, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        time: '12:00:00',
        is_diet: true,
        user_id: 'user-01',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealsResponse = await request(app.server).post('/meals').send({
      title: 'New meal',
      description: 'Description of new meal',
      date: '2024-10-01',
      time: '12:00:00',
      is_diet: true,
      user_id: 'user-01',
    })

    const userId = createMealsResponse.get('userId')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('userId', userId)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        time: '12:00:00',
        is_diet: true,
        user_id: 'user-01',
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    const createMealsResponse = await request(app.server).post('/meals').send({
      title: 'New meal',
      description: 'Description of new meal',
      date: '2024-10-01',
      time: '12:00:00',
      is_diet: true,
      user_id: 'user-01',
    })

    const userId = createMealsResponse.get('userId')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('userId', userId)
      .expect(200)

    const { id } = listMealsResponse.body.meals[0]

    const getMealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set('userId', userId)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        time: '12:00:00',
        is_diet: true,
        user_id: 'user-01',
      }),
    )
  })
})
