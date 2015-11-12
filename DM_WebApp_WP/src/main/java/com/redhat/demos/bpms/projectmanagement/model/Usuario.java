package com.redhat.demos.bpms.projectmanagement.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Entity
@NamedQueries({
		@NamedQuery(name = "Usuario.findByUsuarioYPassword", query = "SELECT u FROM Usuario u WHERE u.usuario = :usuario AND u.password = :password"),
		@NamedQuery(name = "Usuario.findByUsuario", query = "SELECT u FROM Usuario u WHERE u.usuario = :usuario") })
@Table(name = "usuarios")
public class Usuario {

	@Id
	@GeneratedValue
	@Column(name = "id_usuario")
	private Integer idUsuario;

	@NotNull
	@Column(name = "id_rol")
	private Integer idRol;

	@NotNull
	@Size(min = 1, max = 100, message = "1-100 letters and spaces")
	@Pattern(regexp = "[^0-9]*", message = "Must not contain numbers")
	@Column(name = "nombre")
	private String nombre;

	@NotNull
	@Size(min = 1, max = 20, message = "1-20 letters and spaces")
	@Column(name = "usuario")
	private String usuario;

	@NotNull
	@Size(min = 1, max = 20, message = "1-20 letters and spaces")
	@Column(name = "password")
	private String password;

	@Column(name = "fecha_modificacion")
	private Date fechaModificacion;

	public Integer getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(Integer idUsuario) {
		this.idUsuario = idUsuario;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getRol() {
		return idRol;
	}

	public void setRol(Integer idRol) {
		this.idRol = idRol;
	}

	public Date getFechaModificacion() {
		return fechaModificacion;
	}

	public void setFechaModificacion(Date fechaModificacion) {
		this.fechaModificacion = fechaModificacion;
	}
	
	
}
