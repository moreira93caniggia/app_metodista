"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Permission extends Model {
  /**
   * Many-To-Many Relationship Method for accessing the Role.users
   *
   * @return Object
   */
  roles() {
    return this.belongsToMany("App/Models/Role");
  }
}

module.exports = Permission;
