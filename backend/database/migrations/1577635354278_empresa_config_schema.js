'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmpresaConfigSchema extends Schema {
  up () {
    this.table('empresa_configs', (table) => {
      // alter table
      table.integer('user_id').nullable().unsigned().index().after('endereco');
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.table('empresa_configs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EmpresaConfigSchema
