import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.date('date').notNullable()
    table.time('hour').notNullable()
    table.boolean('is_diet').notNullable()
    table.uuid('user_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
