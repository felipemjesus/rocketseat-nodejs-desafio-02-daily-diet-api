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
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get(`/meals/${userId}`)
      .expect(200)

    console.log(listMealsResponse.body)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    const createMealsResponse = await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const id = createMealsResponse.body.meal.id

    const getMealResponse = await request(app.server)
      .get(`/meals/${id}/${userId}`)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      }),
    )
  })

  it('should be able to update a specific meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    const createMealsResponse = await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const id = createMealsResponse.body.meal.id

    const updateMealsResponse = await request(app.server)
      .put(`/meals/${id}/${userId}`)
      .send({
        title: 'New meal updated',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
      })
      .expect(201)

    expect(updateMealsResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'New meal updated',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      }),
    )
  })

  it('should be able to delete a specific meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    const createMealsResponse = await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const id = createMealsResponse.body.meal.id

    await request(app.server)
      .delete(`/meals/${id}/${userId}`)
      .send()
      .expect(204)
  })

  it('should be able to metrics count meals registered by a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get(`/meals/${userId}/registered`)
      .expect(200)

    expect(getMealsResponse.body.user).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    )
  })

  it('should be able to metrics count meals in diet by a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get(`/meals/${userId}/in-diet`)
      .expect(200)

    expect(getMealsResponse.body.user).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    )
  })

  it('should be able to metrics count meals out of diet by a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 0,
        user_id: userId,
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get(`/meals/${userId}/out-diet`)
      .expect(200)

    expect(getMealsResponse.body.user).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    )
  })

  it('should be able to metrics count meals sequence in diet by a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const userId = createUserResponse.body.user.id

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .send({
        title: 'New meal',
        description: 'Description of new meal',
        date: '2024-10-01',
        hour: '12:00:00',
        is_diet: 1,
        user_id: userId,
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get(`/meals/${userId}/sequence-in-diet`)
      .expect(200)

    expect(getMealsResponse.body.user).toEqual(
      expect.objectContaining({
        count: 1,
      }),
    )
  })
})
