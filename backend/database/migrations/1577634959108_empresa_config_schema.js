'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmpresaConfigSchema extends Schema {
  up () {
    this.create('empresa_configs', (table) => {
      table.increments()
      table.text("logotipo").nullable(); 
      table.string("nome", 255).notNullable();   
      table.string("contribuinte", 25).notNullable(); 
      table.string("email", 255).nullable(); 
      table.string("telefone", 255).notNullable();
      table.string("endereco", 255).notNullable(); 
      
      table.timestamps()
    })
  }

  down () {
    this.drop('empresa_configs')
  }
}

module.exports = EmpresaConfigSchema
