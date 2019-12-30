'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.integer('empresa_id').nullable().unsigned().index().after('account_status');
      table.foreign('empresa_id').references('id').on('empresa_configs').onDelete('cascade')

      table.integer('user_id').nullable().unsigned().index().after('account_status');
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
