package com.redhat.demos.bpms.projectmanagement.services.controllers;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.log4j.PropertyConfigurator;
import org.jbpm.services.task.utils.ContentMarshallerHelper;
import org.kie.api.runtime.Environment;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.manager.RuntimeEngine;
import org.kie.api.runtime.process.ProcessInstance;
import org.kie.api.task.TaskService;
import org.kie.api.task.model.Content;
import org.kie.api.task.model.Task;
import org.kie.api.task.model.TaskSummary;
import org.kie.internal.task.api.ContentMarshallerContext;
import org.kie.remote.client.api.RemoteRuntimeEngineFactory;

import com.redhat.demos.bpms.projectmanagement.util.JBPMUtil;

public class JBPMController {

	public static void main(String[] args) throws MalformedURLException {
		PropertyConfigurator
				.configure("/home/admin/workspace/Recursos/log4j.properties");

		JBPMController controller2 = new JBPMController();
		System.out.println("iniciando proceso...");
		long processId = controller2.iniciarProcesoRegistro(JBPMUtil.BPM_DM_REG_PROD_PROCESS_ID);
		System.out.println("proceso "+processId+" iniciado!");
		controller2.listarTareas(JBPMUtil.BPM_DM_ADMIN_USER, JBPMUtil.BPM_DM_ADMIN_PASSWORD);
//		
//		long taskId = 38;
//		controller2.completarTareaAutorizar(taskId);
//		System.out.println("task " + taskId + " completado!");
//		controller2.listarTareas(JBPMUtil.BPM_DM_ADMIN_USER, JBPMUtil.BPM_DM_ADMIN_PASSWORD);

	}

	private void completarTareaAutorizar(long taskId)
			throws MalformedURLException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("tsk_aceptado", true);
		completeTask(taskId, JBPMUtil.BPM_DM_ADMIN_USER, JBPMUtil.BPM_DM_ADMIN_PASSWORD, params);
	}

	private long iniciarProcesoRegistro(String processId)
			throws MalformedURLException {
		Map<String, Object> params = new HashMap<String, Object>();
		SimpleDateFormat sdf = new SimpleDateFormat("ddMMhhmmssSS");
		params.put("nombre", "user");
		params.put("usuario", "u" + sdf.format(new Date().getTime()));
		params.put("password", "pwd123");
		return startProcess(JBPMUtil.BPM_DM_ADMIN_USER, JBPMUtil.BPM_DM_ADMIN_PASSWORD, processId, params);
	}

	private void listarTareas(String userId, String password)
			throws MalformedURLException {
		ArrayList<TaskSummary> al = getUserTasks(userId, password);

		for (TaskSummary taskSummary : al) {
			System.out.println("******************Task**********************");
			System.out.println("Id: " + taskSummary.getId());
			System.out.println("ProcessInstanceId: "
					+ taskSummary.getProcessInstanceId());
			System.out.println("ProcessSessionId: "
					+ taskSummary.getProcessSessionId());
			System.out.println("Name:" + taskSummary.getName());
			System.out.println("ActualOwnerId: "
					+ taskSummary.getActualOwnerId());
			System.out.println("CreatedById: " + taskSummary.getCreatedById());
			System.out
					.println("DeploymentId: " + taskSummary.getDeploymentId());
			System.out.println("ProcessId: " + taskSummary.getProcessId());
			System.out.println("Description: " + taskSummary.getDescription());
			System.out.println("StatusId: " + taskSummary.getStatusId());
			System.out.println("Subject: " + taskSummary.getSubject());
			System.out.println("ParentId: " + taskSummary.getParentId());
			System.out.println("CreatedOn: " + taskSummary.getCreatedOn());
			System.out.println("ExpirationTime: "
					+ taskSummary.getExpirationTime());
			System.out.println("PotentialOwners: "
					+ taskSummary.getPotentialOwners());

			System.out.println("-------------Contenido-------------");
			Set<Entry<String, Object>> contenido = getTaskContent(
					taskSummary.getId(), userId, password).entrySet();
			for (Entry<String, Object> campo : contenido) {
				System.out.println(campo.getKey() + ": " + campo.getValue());
			}
			

			System.out.println("********************************************");

		}

	}

	private RuntimeEngine getRuntimeEngine(String userId, String password)
			throws MalformedURLException {
		RuntimeEngine engine = RemoteRuntimeEngineFactory.newRestBuilder()
				.addDeploymentId(JBPMUtil.BPM_DM_DEPLOYMENT_ID)
				.addUrl(new URL(JBPMUtil.BPM_DM_BUSINESS_CENTRAL_URL))
				.addUserName(JBPMUtil.BPM_DM_ADMIN_USER).addPassword(JBPMUtil.BPM_DM_ADMIN_PASSWORD).build();
		return engine;
	}

	public long startProcess(String starterUser, String password,
			String processId, Map<String, Object> params)
			throws MalformedURLException {

		RuntimeEngine engine = getRuntimeEngine(starterUser, password);
		KieSession kSession = engine.getKieSession();
		ProcessInstance instance = null;
		if (params != null) {
			instance = kSession.startProcess(processId, params);
		} else {
			instance = kSession.startProcess(processId);
		}
		long procId = instance.getId();
		return procId;
	}

	public ArrayList<TaskSummary> getUserTasks(String taskUserId,
			String password) throws MalformedURLException {
		RuntimeEngine engine = getRuntimeEngine(taskUserId, password);
		TaskService taskService = engine.getTaskService();
		ArrayList<TaskSummary> al = (ArrayList<TaskSummary>) taskService
				.getTasksAssignedAsPotentialOwner(taskUserId, "en-UK");
		return al;
	}

	public Task getTask(int taskId, String taskUserId, String password)
			throws MalformedURLException {
		RuntimeEngine engine = getRuntimeEngine(taskUserId, password);
		TaskService taskService = engine.getTaskService();
		Task task = taskService.getTaskById(taskId);
		return task;
	}

	public void completeTask(long taskId, String taskUserId, String password,
			Map<String, Object> params) throws MalformedURLException {
		RuntimeEngine engine = getRuntimeEngine(taskUserId, password);
		TaskService taskService = engine.getTaskService();

		taskService.start(taskId, taskUserId);
		if (params != null) {
			taskService.complete(taskId, taskUserId, params);
		} else {
			taskService.complete(taskId, taskUserId, null);
		}
	}

	public Map<String, Object> getTaskContent(long taskId, String taskUserId,
			String password) throws MalformedURLException {
		Map<String, Object> data = null;

		RuntimeEngine engine = getRuntimeEngine(taskUserId, password);
		TaskService taskService = engine.getTaskService();
		data = (Map<String, Object>) taskService.getTaskContent(taskId);
		return data;
	}
	
	public Map<String, Object> getContentById(long taskId, String taskUserId,
			String password) throws MalformedURLException {
		Map<String, Object> data = null;

		RuntimeEngine engine = getRuntimeEngine(taskUserId, password);
		KieSession session = engine.getKieSession();
		Environment env = session.getEnvironment();
		
		TaskService taskService = engine.getTaskService();
		Content content = taskService.getContentById(taskId);
		byte[] serialized = content.getContent();
		
		
		Object unmarshalledObject = ContentMarshallerHelper.unmarshall(content.getContent(), env);
		return data;
	}

}
