package com.redhat.demos.bpms.projectmanagement.services;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.kie.api.task.model.TaskSummary;

import com.redhat.demos.bpms.projectmanagement.model.Project;
import com.redhat.demos.bpms.projectmanagement.model.TaskView;
import com.redhat.demos.bpms.projectmanagement.model.Usuario;
import com.redhat.demos.bpms.projectmanagement.services.controllers.JBPMController;
import com.redhat.demos.bpms.projectmanagement.services.controllers.UserController;
import com.redhat.demos.bpms.projectmanagement.services.dto.JBPMCompleteTaskRequest;
import com.redhat.demos.bpms.projectmanagement.services.dto.JBPMResult;
import com.redhat.demos.bpms.projectmanagement.services.dto.JBPMStartProcessRequest;
import com.redhat.demos.bpms.projectmanagement.util.JBPMUtil;
import com.sun.istack.logging.Logger;

@Path("/jbpm")
public class JBPMService {

	private static final Logger log = Logger.getLogger(JBPMService.class);

	@Inject
	JBPMController jbpmController;

	@Inject
	UserController userController;

	@POST
	@Path("/start")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public JBPMResult startProcess(JBPMStartProcessRequest request,
			@Context HttpServletRequest req) {
		// Ejemplo request
		// {"params":{"tres":"Valor3","uno":"Valor1","dos":"Valor2"}}
		JBPMResult result = new JBPMResult();
		try {
			String usuario = req.getUserPrincipal().toString();
			log.info("Logged Username: " + usuario);
			Usuario user = userController.getUserByUsuario(req
					.getUserPrincipal().toString());
			long processId = jbpmController.startProcess(user.getUsuario(),
					user.getPassword(), JBPMUtil.BPM_DM_REG_PROD_PROCESS_ID,
					request.getParams());
			Project project = new Project();
			project.setDescription((String) request.getParams().get(
					"projectDesc"));
			project.setProjectId((String) request.getParams().get("projectId"));
			project.setProcessInstanceId(processId);
			project.setJustify((String) request.getParams().get(
					"projectJustify"));
			project.setName((String) request.getParams().get("projectName"));
			result.setResult(true);
			result.setDescription("OK");
		} catch (MalformedURLException e) {
			result.setResult(false);
			result.setDescription("Error: " + e.getMessage());
		}
		if (result.isResult() == true) {
			Usuario objUsuario = userController
					.getUserByUsuario((String) request.getParams().get(
							"businessUser"));
		}
		return result;
	}

	@RolesAllowed({ "Administrador" })
	@POST
	@Path("/completeTask")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public JBPMResult completeTask(JBPMCompleteTaskRequest request,
			@Context HttpServletRequest req) {
		// Ejemplo request
		// {"taskId": 5,
		// "params":{"tres":"Valor3","uno":"Valor1","dos":"Valor2"}}
		JBPMResult result = new JBPMResult();
		try {
			Usuario user = userController.getUserByUsuario(req
					.getUserPrincipal().toString());
			jbpmController.completeTask(request.getTaskId(), user.getUsuario(),
					user.getPassword(), request.getParams());
			result.setResult(true);
			result.setDescription("OK");
		} catch (MalformedURLException e) {
			result.setResult(false);
			result.setDescription("Error: " + e.getMessage());
		}
		return result;
	}

	@RolesAllowed({ "Administrador" })
	@GET
	@Path("/tasks")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TaskView> getTasks(@Context HttpServletRequest req) {
		List<TaskView> tasks = new ArrayList<TaskView>();
		try {
			Usuario user = userController.getUserByUsuario(req
					.getUserPrincipal().toString());
			List<TaskSummary> summaries = jbpmController.getUserTasks(
					user.getUsuario(), user.getPassword());
			for (TaskSummary summary : summaries) {
				TaskView tv = new TaskView();
				tv.setSummary(summary);
				Map<String, Object> taskData = jbpmController.getTaskContent(
						summary.getId(), user.getUsuario(), user.getPassword());
				tv.setContent(taskData);
				;
				tasks.add(tv);
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return tasks;
	}

	@RolesAllowed({ "Administrador" })
	@GET
	@Path("/content/{taskid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> getTaskContent(@PathParam("taskid") int taskId,
			@Context HttpServletRequest req) {
		Map<String, Object> content = null;
		try {
			Usuario user = userController.getUserByUsuario(req
					.getUserPrincipal().toString());
			content = jbpmController.getTaskContent(taskId, user.getUsuario(),
					user.getPassword());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return content;
	}
}
