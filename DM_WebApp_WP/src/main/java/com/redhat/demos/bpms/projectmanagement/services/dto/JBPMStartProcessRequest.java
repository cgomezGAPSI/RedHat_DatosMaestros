package com.redhat.demos.bpms.projectmanagement.services.dto;

import java.util.Map;

public class JBPMStartProcessRequest {

	private String usuario;
	private String password;
	private Map<String, Object> params;

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

	public Map<String, Object> getParams() {
		return params;
	}

	public void setParams(Map<String, Object> params) {
		this.params = params;
	}

}
