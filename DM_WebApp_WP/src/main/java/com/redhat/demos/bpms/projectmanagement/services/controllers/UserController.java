package com.redhat.demos.bpms.projectmanagement.services.controllers;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.UserTransaction;

import com.redhat.demos.bpms.projectmanagement.model.Usuario;

public class UserController {

	@PersistenceContext(unitName = "project-management-persistence-unit")
	EntityManager em;

	@Resource
	private UserTransaction utx;

	public Usuario getUsuarioByUsuarioYPassword(String usuario, String password) {
		Usuario objUsuario = null;
		Query q = em.createNamedQuery("User.findByUsuarioYPassword",
				Usuario.class);
		q.setParameter("usuario", usuario);
		q.setParameter("password", password);
		try {
			Object result = q.getSingleResult();
			if (result != null) {
				objUsuario = (Usuario) result;
			}
		} catch (NoResultException e) {
			e.printStackTrace();
		}
		return objUsuario;
	}
	
	public Usuario getUserByUsuario(String ususario) {
		Usuario objUsuario = null;
		Query q = em.createNamedQuery("User.findByUsuario",
				Usuario.class);
		q.setParameter("usuario", ususario);
		try {
			Object result = q.getSingleResult();
			if (result != null) {
				objUsuario = (Usuario) result;
			}
		} catch (NoResultException e) {
			e.printStackTrace();
		}
		return objUsuario;
	}
}
