'use strict'

const Role = use("App/Models/Role"); 
const User = use("App/Models/User");
const Database = use("Database");
const DataResponse = use("App/Models/DataResponse");

class AuthController {

  async authenticate({ request, auth, response }) {
    let dado = { user: null, token: null, role: null, permissions: null };
    let permissions = [];

    const { refreshToken, username, password } = request.all();

    if (refreshToken) {
      dado.token = await auth.withRefreshToken().query((builder) => { builder.where('account_status', 1) }).attempt(username, password)
      //dado.token = await auth.generateForRefreshToken(refreshToken, true);
      dado.user = await User.findBy("username", username);
    }

    try {
      dado.token = await auth.withRefreshToken().query((builder) => { builder.where('account_status', 1) }).attempt(username, password);
      const user = await User.findBy("username", username);
      dado.role = await user.getRoles();
      dado.user = {
        email: user.email, 
        id: user.id,
        account_status: user.account_status,
        nome: user.nome,
        telefone: user.telefone,
        username: user.username,
        morada: user.morada,
        empresa_id: user.empresa_id
      };

      for (let v = 0; v < dado.role.length; v++) {
        let role = await Role.findBy("slug", dado.role[v]);

        let permissionSlugs = await role.getPermissions();

        for (let i = 0; i < permissionSlugs.length; i++) {
          permissions.push(permissionSlugs[i]);
        }
      }
      dado.permissions = permissions;

      return DataResponse.response( "error", response.response.statusCode, "Seja Bem vindo senhor(a) " + dado.user.nome, dado  );
    } catch (e) {
      return response.status(400).send({ title: "Falha na Autenticação",message: "Nome de utilizador ou Password Inválido, ou consulta o administrador para verificar se a sua conta está activa" });
      // return response.send(Mensagem.response(401, 'Username ou password inválido', dado))
    }
  }
}

module.exports = AuthController
