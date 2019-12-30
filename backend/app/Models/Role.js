"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Role extends Model {
  /**
   * Many-To-Many Relationship Method for accessing the Role.users
   *
   * @return Object
   */
  users() {
    return this.belongsToMany("App/Models/User");
  }

  /**
   * Many-To-Many Relationship Method for accessing the Role.users
   *
   * @return Object
   */
  permissions() {
    return this.belongsToMany("App/Models/Permission");
  }

  async getPermissions() {
    const permissions = await this.permissions().fetch();
    return permissions.rows.map(({ slug }) => slug);
  }
}

module.exports = Role;
