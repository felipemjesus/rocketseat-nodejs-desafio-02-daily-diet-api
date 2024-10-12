import { describe, it, beforeAll, afterAll, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Users', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)
  })

  it('should be able to list all users', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'New user',
        email: 'newuser@email.com',
      }),
    ])
  })

  it('should be able to get a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const { id } = createUserResponse.body.user

    const getUserResponse = await request(app.server)
      .get(`/users/${id}`)
      .expect(200)

    expect(getUserResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'New user',
        email: 'newuser@email.com',
      }),
    )
  })

  it('should be able to update a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const { id } = createUserResponse.body.user

    const updateUserResponse = await request(app.server)
      .put(`/users/${id}`)
      .send({
        name: 'New user updated',
        email: 'newuser@email.com',
      })
      .expect(201)

    expect(updateUserResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'New user updated',
        email: 'newuser@email.com',
      }),
    )
  })

  it('should be able to delete a specific user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New user',
        email: 'newuser@email.com',
      })
      .expect(201)

    const { id } = createUserResponse.body.user

    await request(app.server).delete(`/users/${id}`).send().expect(204)
  })
})
