package com.redhat.demos.bpms.projectmanagement.services;

import java.io.IOException;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.redhat.demos.bpms.projectmanagement.model.Login;
import com.redhat.demos.bpms.projectmanagement.model.Usuario;
import com.redhat.demos.bpms.projectmanagement.services.controllers.UserController;
import com.sun.istack.logging.Logger;

@Path("/authenticate")
@RolesAllowed("logged")
public class LoginService {

	private static final Logger log = Logger.getLogger(LoginService.class);

	@Inject
	UserController userController;

	@GET
	@Path("/login/info")
	@Produces(MediaType.APPLICATION_JSON)
	public Login info(@Context HttpServletRequest req) {
		Login login = new Login();
		Usuario objUsuario = userController.getUserByUsuario(req.getUserPrincipal()
				.toString());
		if (objUsuario != null) {
			login.setResult(true);
			login.setNombre(objUsuario.getNombre());
			login.setRol(objUsuario.getRol());
		} else {
			login.setResult(false);
			login.setError("Usuario no registrado");
		}
		return login;
	}

	@GET
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	public Login login(@QueryParam("usuario") String usuario,
			@QueryParam("password") String password) {
		Login login = new Login();
		Usuario objUsuario = userController.getUsuarioByUsuarioYPassword(usuario,
				password);
		if (objUsuario != null) {
			login.setResult(true);
			login.setNombre(objUsuario.getNombre());
			login.setRol(objUsuario.getRol());
		} else {
			login.setResult(false);
			login.setError("Usuario no registrado");
		}
		return login;
	}

	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public void logout(@Context HttpServletRequest req,
			@Context HttpServletResponse resp) {
		System.out.println("Logging out..");
		log.info("Logging out...");
		req.getSession().invalidate();
		try {
			req.logout();
			resp.setHeader("WWW-Authenticate", "Basic realm=\"bpms\"");
			resp.setHeader("Authenticate", "Basic realm=\"bpms\"");
			resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
		} catch (ServletException e) {
			log.severe("Error al ejecutar logout...", e);
		} catch (IOException e) {
			log.severe("Error al ejecutar logout...", e);
		}
	}
}
