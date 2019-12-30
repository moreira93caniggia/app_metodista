'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DataResponse extends Model {

    static response(estado, codigo, mensagem, dado){
        return {
          status: estado,
          code: codigo,
          message: mensagem,
          data: dado
    
        }
      }
}

module.exports = DataResponse
