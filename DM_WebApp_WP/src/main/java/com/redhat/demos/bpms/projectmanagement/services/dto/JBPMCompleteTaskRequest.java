package com.redhat.demos.bpms.projectmanagement.services.dto;

import java.util.Map;

public class JBPMCompleteTaskRequest {

	private String usuario;
	private String password;
	private int taskId;
	private Map<String, Object> params;

	public String getUsuario() {
		return usuario;
	}

	public void setUsername(String usuario) {
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

	public int getTaskId() {
		return taskId;
	}

	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}
}
