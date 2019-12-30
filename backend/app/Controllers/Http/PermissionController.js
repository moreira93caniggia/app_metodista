'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database'); 
const DataResponse = use('App/Models/DataResponse');  
const Permission = use('App/Models/Permission');
const Role = use("App/Models/Role");
/**
 * Resourceful controller for interacting with permissions
 */
class PermissionController {
  /**
   * Show a list of all Permissions.
   * GET Permissions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index({ request }) { 
 
	const { search, orderBy, pagination} = request.all();
    let res = null;

    if (search == null) {
      res = await Database.select('permissions.slug','permissions.id','permissions.name','permissions.description','permissions.created_at','permissions.updated_at').from('permissions')
	  //.innerJoin('modules', 'modules.id', 'permissions.module_id')
	  .orderBy(orderBy == null ? 'permissions.created_at' : orderBy, 'DESC')
    .paginate(pagination.page, pagination.perPage);
    } else {
      res = await Database.select('permissions.slug','permissions.id','permissions.name','permissions.description','permissions.created_at','permissions.updated_at').from('permissions') 
		//.innerJoin('modules', 'modules.id', 'permissions.module_id')
        .where('permissions.slug', 'like', '%' + search + "%") 
        .orWhere('permissions.name', 'like', '%' + search + "%") 
		.orWhere('permissions.description', 'like', '%' + search + "%")
		//.orWhere('modules.nome', 'like', '%' + search + "%")		
		.orWhere(Database.raw('DATE_FORMAT(permissions.created_at, "%Y-%m-%d")'), 'like', '%' + search + "%") 
    .orderBy(orderBy == null ? 'permissions.created_at' : orderBy, 'DESC')
    .paginate(pagination.page, pagination.perPage);
    }


    return DataResponse.response("success", 200, "", res);
  }

  /**
   * Render a form to be used for creating a new permissions.
   * GET permissionss/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new permissions.
   * POST permissionss
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

   
   async store ({ request }) { 

    //console.log(request.all())
    /*
    const permission = await Permission.create({ name, description, slug });
  return DataResponse.response("success", 200, "registado com sucesso", permission); 
  */

  const { slug, name, description } = request.all();
  const permission = await Permission.query()
    .where("slug", slug)
    .orWhere("description", description)
    .orWhere("name", name)
    .getCount();
  if (permission > 0) {
    
    return DataResponse.response(
      "success",
      500,
      "Já existe um mesmo slug ou nome ou descrição",
      permission
    );
  } else {
    
    const permission = await Permission.create({
      name, description, slug 
    });
    return DataResponse.response(
      "success",
      200,
      "Registado com sucesso",
      permission
    );
  }
     
  }
  

   /**
   * get All Permissions of a role
   * GET Role's Permissions
   *
   * @author Caniggia Moreira caniggiamoreira@gmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getAllPermissionsOfRole({params, request, response, auth}) {
    const role = await Role.find(params.id)

    const user = await auth.getUser()

    const permissionsOfRole = [];
    const permissions = await Permission.all();
    const permissionsJson = permissions.toJSON();
    const permissoesActuais = await role.getPermissions();

    permissionsJson.forEach(function (x) {

      if (permissoesActuais.includes(x.slug)) {
        permissionsOfRole.push({
          id: x.id,
          slug: x.slug,
          name: x.name,
          description: x.description,
          isActivo: true
        });
      } else {
        permissionsOfRole.push({
          id: x.id,
          slug: x.slug,
          name: x.name,
          description: x.description,
          isActivo: false
        });
      }
    })
    return DataResponse.response("success", 200, "", permissionsOfRole);
  }

  /**
   * Update permissoes of a role
   * UPDATE Role's Permissions
   *
   * @author Paulino Esperança paulino19902013@gmail.com
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  /*
  async store({params, request, response, auth}) {
    
    const role = await Role.find(params.id);
    const {permissoes} = request.all();
    await Database.table('permission_role').where('role_id', role.id).delete();

    for (let v = 0; v < permissoes.length; v++) {
      const per = await Permission.find(permissoes[v]);
      await role.permissions().attach([per.id]);
    }
    	return DataResponse.response("success", 200, "Permissões do perfil actualizadas com sucesso", null);
  }

  */


  /**
   * Display a single permissions.
   * GET permissionss/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
	  res = await Database.select('*').from('permissions').where('module_id',params.id)
  }

  /**
   * Render a form to update an existing permissions.
   * GET permissionss/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update permissions details.
   * PUT or PATCH permissionss/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */ 
   async update({ params, request, response }) {
    const data = request.only(['slug', 'name', 'description']); 
    // update with new data entered 
    const permission = await Permission.find(params.id);
    permission.merge(data);
    await permission.save();
    return DataResponse.response("success", 200, "Dados actualizados com sucesso", permission);

  }

  /**
   * Delete a permissions with id.
   * DELETE permissionss/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PermissionController
