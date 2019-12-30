'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ResponseMessage extends Model {
    static response(codigo, mensagem, dado) {
        return {
            code: codigo,
            message: mensagem,
            data: dado
        }
    }
}

module.exports = ResponseMessage
