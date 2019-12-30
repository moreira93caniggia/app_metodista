'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database');
const DataResponse = use('App/Models/DataResponse');
const Role = use('App/Models/Role');
const Permission = use('App/Models/Permission');
/**
 * Resourceful controller for interacting with Roles
 */
class RoleController {
  /**
   * Show a list of all Roles.
   * GET Roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request }) {

    const { start, end, search, order } = request.all();
    let res = null;

    if (search == null) {
      res = await Database.select('*').from('roles').orderBy(order, 'asc').paginate(start, end);
    } else {
      res = await Database.select('*').from('roles')
        .where('name', 'like', '%' + search + "%")
        .orWhere('description', 'like', '%' + search + "%")
        .orWhere(Database.raw('DATE_FORMAT(created_at, "%Y-%m-%d")'), 'like', '%' + search + "%")
        .orderBy(order, 'asc').paginate(start, end);
    }


    return DataResponse.response("success", 200, "", res);
  }

  /**
   * Render a form to be used for creating a new Role.
   * GET Roles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }


  /**
   * Create/save a new Role.
   * POST Roles
   *
   * @author Caniggia Moreira caniggiamoreira@hotmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    //requisição dos dados vindo via POST do frontend
    const { name, slug, description } = request.all();
    const role = await Role.create({ name: name, slug: slug, description: description });
    return DataResponse.response("success", 200, "registado com sucesso", role);
  }

  /**
   * Display a single Role.
   * GET Roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing Role.
   * GET Roles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update Role details.
   * PUT or PATCH Roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const data = request.only(['name', 'slug', 'description']);
    // update with new data entered 
    const role = await Role.find(params.id);
    role.merge(data);
    await role.save();
    return DataResponse.response("success", 200, "Dados actualizados com sucesso", role);

  }

  /**
   * Delete a Role with id.
   * DELETE Roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }


  /**
  * selectOptionRole a list of all Roles.
  * GET Roles
  *
  * @param {object} ctx 
  */
  async selectOptionRole() {
    const res = await Database.select('*').from('roles');
    return DataResponse.response("success", 200, "", res);
  }

  async adicionarPermissionRole({ request }) {

    const { role_id, permission_id } = request.all();

    const count = await Database.from('permission_role').where('role_id', role_id).where('permission_id', permission_id).count()
    const total = count[0]['count(*)']
    //console.log(role_id + " " + permission_id);
    if (total > 0) {
      await Database.table('permission_role').where('role_id', role_id).where('permission_id', permission_id).delete();
    } else {
      //const rolePermissions = await RolePermission.create({ role_id, permission_id }); 

      const role = await Role.find(role_id);
      const per = await Permission.find(permission_id);
      await role.permissions().attach([per.id]);

    }
    return DataResponse.response("success", 200, "registado com sucesso", count);
  }

  /**
  * Display a single permissions.
  * GET permissionss/:id
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async role_permissions_show({ params }) {
    const res = await Database.select('*').from('role_permissions').where('role_id', params.id)
    return DataResponse.response("success", 200, "registado com sucesso", res);
  }

  async roleReportDiario({ request }) {
    const { search, orderBy, pagination } = request.all();
    let res = null;

    if (search == null) {
      res = await Database.select(
        "id",
        "slug",
        "name",
        "description"
      )
        .from("roles")
        .orderBy(orderBy == null ? 'name' : orderBy, 'DESC')
        .paginate(pagination.page, pagination.perPage);
    } else {
      res = await Database.select(
        "id",
        "slug",
        "name",
        "description"
      )
        .from("roles")
        .where('name', 'like', '%' + search + "%")
        .orWhere('description', 'like', '%' + search + "%")
        .orWhere('slug', 'like', '%' + search + "%")
        .orderBy(orderBy == null ? "name" : orderBy, "DESC")
        .paginate(pagination.page, pagination.perPage);
    }

    return DataResponse.response("success", 200, "", res);
  }


  async getRoleSlug({ params }) {
    let role = null;
    role = await Database.select('id', 'slug')
      .table('roles')
      .where('id', params.id).first()


    let data = {
      role: role,
    };

    return DataResponse.response("success", 200, "", data);
  }


  async roleReportDiarioAuto() {

    let res = null;

    res = await Database.select('id','slug','name','description')
      .table('roles')

      return DataResponse.response("success", 200, "", res);


  }

}

module.exports = RoleController
