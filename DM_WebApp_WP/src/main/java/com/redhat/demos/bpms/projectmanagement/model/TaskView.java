package com.redhat.demos.bpms.projectmanagement.model;

import java.util.Map;

import org.kie.api.task.model.TaskSummary;

public class TaskView {

	private TaskSummary summary;
	private Map<String, Object> content;

	public TaskSummary getSummary() {
		return summary;
	}

	public void setSummary(TaskSummary summary) {
		this.summary = summary;
	}

	public Map<String, Object> getContent() {
		return content;
	}

	public void setContent(Map<String, Object> content) {
		this.content = content;
	}

}
