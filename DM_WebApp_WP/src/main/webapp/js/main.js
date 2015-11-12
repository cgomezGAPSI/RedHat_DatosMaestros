$(document).ready(function(){
	
	//Global Variables
	var restUrl = "http://localhost:8080/project/rest/";
	var userEmail;
	var userRole;
	var loggedName;
	var ounits = [];
	var currentTaskId;
	var currentProjectName;
	var lastLoadedTasks;
	var lastLoadedTasksName;
	var uploadedFiles = [];
	var nextApprovedUser;
	var nextRejectedUser;
	
	//Load Dashboard on window loading
	$(window).load(function($) {
	    loadDashboard();
	});
	
	//Menu Bar functions
	$(document).on('click', '#tasksrequirements', function( e ) {
		loadTasks(e, "tasksrequirements.html", "Definir requerimientos de alto nivel");
	});
	
	$(document).on('click', '#tasksdetails', function( e ) {
		loadTasks(e, "tasksdetails.html", "Definir requerimientos detallados");
	});
	
	$(document).on('click', '#tasksunderstandings', function( e ) {
		loadTasks(e, "tasksunderstandings.html", "Entendimiento");
	});
	
	$(document).on('click', '#tasksreviews', function( e ) {
		loadTasks(e, "tasksreviews.html", "Peer Review");
	});
	
	$(document).on('click', '#tasksaproves', function( e ) {
		loadTasks(e, "tasksaproves.html", "Aprobacion");
	});
	
	$(document).on('click', '#tasksasigns', function( e ) {
		loadTasks(e, 'tasksasigns.html', 'Asigna Revisor');
	});
	
	$(document).on('click', '#start', function( e ) {
		loadStartProyect(e);
	});
	
	$(document).on('click', '#exit', function( e ) {
		executeLogoutAction(e);
	});
	
	$('body').on('click', 'button.showinfo', function(){ //Show Info button click
		loadShowTaskInfoPage(this.id);
    });
	
	//######### Elements Events Actions ###########
	
	//Login button click
	$("#btnlogin").click(function(e){
		executeLoginAction(e);
	});
	
	//Create project button click
	$(document).on('click', '#btncreateproject', function( e ) { 
		executeCreateProjectAction(e);
	});
	
	//Peer Approve button click
	$('body').on('click', 'button.aprovePeer', function(e){ 
		executeAprovedAction(e,'true');
	});
	
	//Peer Reject button click
	$('body').on('click', 'button.rejectPeer', function(e){
		executeAprovedAction(e,'false');
	});
	
	//Lider Approve click
	$('body').on('click', 'button.aproveLider', function(e){
		executeAprovedAction(e,'true');
	});
	
	//Lider Reject button click
	$('body').on('click', 'button.rejectLider', function(e){ 
		executeAprovedAction(e,'false');
	});
	
	//Complete Upload task button click
	$('body').on('click', 'button.completeUpload', function(e){
		executeCompleteUploadTask(e);
	});
	
	//Complete Assign task button click
	$('body').on('click', 'button.completeAssign', function(e){
		executeCompleteAssignTask(e);
	});
	
	//Upload Single File
	$('body').on('click', 'button.btnupload', function(e){  
		executeUploadFile(e);
	});
	
	//########### Load Pages Functions ############
	
	//Load main dashboard
	var loadDashboard = function(){ 
		var requestUrl = restUrl+"authenticate/login/info";
		ajaxGetRequest(requestUrl, function(data) {
			if(data.result==false) {
		    	MsgPop.open({
			      	  Type:  "error",
			       	  Content:"Usuario no registrado!"});
			} else if(data.result==true){
				loggedName=data.name;
				userEmail=data.email;
				userRole=data.role;
				$("div.dashboard-container").load("templates/dashboard.html",function() {
					$("#logged").text(loggedName);
				});
			} 
		})
	}
	
	//Load start proyect page
	var loadStartProyect = function(e){ 
		e.preventDefault();
		$("div.page-wrapper").load("templates/start.html",function(e){
			var comboRaci = '<option value="R">Responsible</option>'+
				  			'<option value="A">Accountable</option>'+
				  			'<option value="C">Consulted</option>'+
				  			'<option value="I">Informed</option>'+
				  			'</select>';
			var requestUrl = restUrl+"logic/ou";
			ajaxGetRequest(requestUrl, function(data) {
				ounits = [];
			    $.each(data, function(i, item) {
			    	var ounit = item.idOrganizationalUnit;
			    	var ourole = item.role;
			    	ounits.push(ourole);
			    	var tblrow = '<tr><td id="'+ourole+'">'+ounit+'</td><td id="name'+ounit+'">'+
			    				item.name+'</td><td>'+
			    				'<input type="text" id="user'+ourole+'"/></td>'+
			    				'<td><select id="raci'+ourole+'">'+comboRaci+'</td>';
			    	$('#ounits > tbody:first').append(tblrow);

			    })
			})
		});
	}
	
	//Show upload files page
	var loadUploadedFiles = function(){ 
		$("div.page-wrapper").load("templates/taskupload.html", function(e){
			var requestUrl = restUrl+"jbpm/content/"+currentTaskId;
			ajaxGetRequest(requestUrl, function(data) {
				if(data.approvedUser !=null){
					nextApprovedUser = data.approvedUser;
				}
				$("#projectName").text('Projecto '+data.rprojectId+' : '+data.rprojectName);
			    currentProjectName = data.rprojectName;
			    uploadedFiles = [];
			    
			    var tblrow = '<tr><td>Documento de Visi&oacute;n</td><td>'+data.rdocVision+'</td></tr>';
			    tblrow = tblrow+'<tr><td>Matr&iacute;z de Trazabilidad</td><td>'+data.rdocMatrizTrazabilidad+'</td></tr>';
			    tblrow = tblrow+'<tr><td>Matr&iacute;z de Evaluacion</td><td>'+data.rdocMatrizEvaluacion+'</td></tr>';
			    tblrow = tblrow+'<tr><td>Especificaci&oacute;n de Soluci&oacute;n</td><td>'+data.rdocEspecificacionSolucion+'</td></tr>';
			    tblrow = tblrow+'<tr><td>Documento de Entendimiento</td><td>'+data.rdocEntendimiento+'</td></tr>';
			    $('#tblUploadedFiles > tbody:first').append(tblrow);
			})
		})
	}
	
	//Show assign reviewer page
	var loadAssignReview = function(){ 
		$("div.page-wrapper").load("templates/taskasign.html", function(e){
			var requestUrl = restUrl+"jbpm/content/"+currentTaskId;
			ajaxGetRequest(requestUrl, function(data){
				$("#projectName").text('Projecto '+data.rprojectId+' : '+data.rprojectName);
		    	var taskInfo = getTaskInfoHtml(data);
		    	$('#tbltaskinfo > tbody:first').append(taskInfo);
			});
		})
	}
	
	//Load Peer review page
	var loadPeerReview = function(){ 
		$("div.page-wrapper").load("templates/taskreview.html", function(e){
			var requestUrl = restUrl+"jbpm/content/"+currentTaskId;
			ajaxGetRequest(requestUrl, function(data) {
				$("#projectName").text('Projecto '+data.rprojectId+' : '+data.rprojectName);
		    	var taskInfo = getTaskInfoHtml(data);
		    	$('#tbltaskinfo > tbody:first').append(taskInfo);
			})
		})
	}
	
	//Load approve page 
	var loadAproves = function(){ 
		$("div.page-wrapper").load("templates/taskaprove.html", function(e){
			var requestUrl = restUrl+"jbpm/content/"+currentTaskId;
			ajaxGetRequest(requestUrl, function(data) {
				nextApprovedUser = data.approvedUser;
				nextRejectedUser = data.rejectedUser;
				$("#projectName").text('Projecto '+data.rprojectId+' : '+data.rprojectName);
		    	var taskInfo = getTaskInfoHtml(data);
		    	$('#tbltaskinfo > tbody:first').append(taskInfo);
			})
		})
	}
	
	//Show task detail page for task 
	var loadShowTaskInfoPage = function(id){ 
		currentTaskId = id;
		if(lastLoadedTasks=='tasksasigns.html'){
			console.log("HTML tasksasigns.html");
			loadAssignReview();
		}else if(lastLoadedTasks=='tasksreviews.html'){
			console.log("HTML tasksreviews.html");
			loadPeerReview();
		}else if(lastLoadedTasks=='tasksaproves.html'){
			console.log("HTML tasksaproves.html");
			loadAproves();
		}else{
			console.log("HTML taskupload.html");
			loadUploadedFiles()
		}
	}
	
	//######## Actions functions ###########
	
	//Logout action
	var executeLogoutAction = function(e){ 
		e.preventDefault();
		var requestUrl = restUrl+"authenticate/logout";
		document.execCommand("ClearAuthenticationCache");
		window.location.href='Logout.html';
//			ajaxGetRequestWithCustomError(requestUrl, function(data) {
//				var request = new XMLHttpRequest();                                        
//			    request.open("get", "/logout", false, "false", "false");                                                                                                                               
//			    request.send();  
//				window.location.href='Logout.html';
				
//			},
//			function(xhr,status,error){
//				window.location.href='Logout.html';
//			})
	}
	
	//Login action (Not used and is only for login without JAAS)
	var executeLoginAction = function(e){ 
		e.preventDefault();
		var username = $("#username").val();
		var password = $("#password").val();
		if( username == 'username' || username == '' || password == 'password' || password ==''){
			MsgPop.open({
	          	  Type:  "error",
	          	  Content:"Debe ingresar todos los campos!"});
		}else {
			var requestUrl = restUrl+"authenticate/login/"+username+"/"+password;
			ajaxGetRequest(requestUrl, function(data) {
				if(data.result==false) {
			    	MsgPop.open({
				      	  Type:  "error",
				       	  Content:"Usuario no registrado!"});
				} else if(data.result==true){
					loggedName=data.name;
					userEmail=data.email;
					userRole=data.role;
					$("div.dashboard-container").load("templates/dashboard.html",function() {
						$("#logged").text(loggedName);
					});
				} 
			})
		}
	}
	
	//Create project Action
	var executeCreateProjectAction = function(e){ 
		e.preventDefault();
		if(userRole == 'CPD'){
			var jsonRequest = new Object();
			jsonRequest.projectId = $("#projectid").val();
			jsonRequest.projectName = $("#projectname").val();
			jsonRequest.projectJustify = $("#projectjustify").val();
			jsonRequest.projectDesc = $("#projectdesc").val();
			
			
			$.each(ounits, function(i, item) {
				var skunitrole = '#'+item;
				var skunit = $(skunitrole).text();
				var skunitname = '#user'+item;
				var skname = $(skunitname).val();
				//var sk = skunit+':'+skname+':'+skraci;
				jsonRequest[item] = skname;
		    });
			
			var jbpmRequest = new Object();
			jbpmRequest.params = jsonRequest;
			
			var json_data = JSON.stringify(jbpmRequest);
		
			var requestUrl = restUrl+"jbpm/start";
			ajaxPostRequest(requestUrl, json_data, function(data) {
				if(data.result==false) {
			    	MsgPop.open({
				          	  Type:  "error",
				          	  Content:"El proyecto no pudo crearse"});
				} else if(data.result==true){
					MsgPop.open({
				          	  Type:  "success",
				          	  Content:"Proyecto iniciado!"});
				} 
			})
		}else{
			MsgPop.open({
	          	  Type:  "error",
	          	  Content:"El usuario no pertenece al grupo CPD!"});
		}
	}
	
	//Complete Upload Page Task
	var executeCompleteUploadTask = function(e){
		var requestUrl = restUrl+"jbpm/completeTask";
		e.preventDefault();
		var json = '{"taskId": '+currentTaskId+',"params":{';
		$.each(uploadedFiles, function(i, item) {
			json = json+item+',';
		})
		json = json+'"filedummy":"dummy"}}';
		ajaxPostRequest(requestUrl, json, function(data) {
			if(data.result==false) {
	    		MsgPop.open({
		          	  Type:  "error",
		          	  Content:"Error al finalizar la tarea!"});
			} else if(data.result==true){
				if(lastLoadedTasksName == 'Entendimiento'){
					emailSend(nextApprovedUser, 'igalvanl@redhat.com', 'Aprobacion Requerida', 
							'Estimado '+nextApprovedUser+': Existe un nuevo proyecto que requiere su aprobacion. Acceder a http://localhost:8080/project/index.html', 
							function(data){
								console.log("Email sent!");
							}
					)
				}
				MsgPop.open({
		          	  Type:  "success",
		          	  Content:"Tarea completada!"});
				loadTasks(e,lastLoadedTasks, lastLoadedTasksName);
			} 
		})
	}
	
	//Complete Assign Task
	var executeCompleteAssignTask = function(e){
		e.preventDefault();
		var assign = $('#reviewer').val();
		var requestUrl = restUrl+"jbpm/completeTask";
		var json = '{"taskId": '+currentTaskId+',"params":{"trevisor":"'+assign+'"}}'
		ajaxPostRequest(requestUrl, json, function(data) {
			if(data.result==false) {
	    		MsgPop.open({
		          	  Type:  "error",
		          	  Content:"Error al finalizar la tarea!"});
			} else if(data.result==true){
				emailSend(assign, 'igalvanl@redhat.com', 'Aprobacion Requerida', 
						'Estimado '+assign+': Existe un nuevo proyecto que requiere su aprobacion. Acceder a http://localhost:8080/project/index.html', 
						function(data){
							console.log("Email sent!");
						}
				)
				MsgPop.open({
		          	  Type:  "success",
		          	  Content:"Tarea completada!"});
				loadTasks(e,lastLoadedTasks, lastLoadedTasksName);
			} 
		})
	}
	
	//Approve Peer and Lider Tasks
	var executeAprovedAction = function(e, approved){
		e.preventDefault();
		var requestUrl = restUrl+"jbpm/completeTask";
		var json = '{"taskId": '+currentTaskId+', "params":{"approved":"'+approved+'"}}'
		ajaxPostRequest(requestUrl, json, function(data) {
			if(data.result==false) {
	    		MsgPop.open({
		          	  Type:  "error",
		          	  Content:"Error al finalizar la tarea!"});
			} else if(data.result==true){
				if(approved == 'true'){
					emailSend(nextApprovedUser, 'igalvanl@redhat.com', 'Aprobacion Requerida', 
							'Existe un nuevo proyecto que requiere su aprobacion. Acceder a http://localhost:8080/project/index.html', 
							function(data){
								console.log("Email sent!");
							}
					)
				}else{
					emailSend(nextRejectedUser, 'igalvanl@redhat.com', 'Requerimiento de Alto nivel requerido', 
							'Se solicita que modifique los requerimientos de alto nivel de un proceso. Acceder a http://localhost:8080/project/index.html', 
							function(data){
								console.log("Email sent!");
							}
					)
				}
				
				MsgPop.open({
		          	  Type:  "success",
		          	  Content:"Tarea completada!"});
				loadTasks(e,lastLoadedTasks, lastLoadedTasksName);
			} 
		})
	}
	
	//Upload one file from upload page
	var executeUploadFile = function(e){
		e.preventDefault();
		var filename = $('#uploadname').val();
		var filepath = $('#uploadctl').val();
		var fileRealName = filepath.substring(filepath.lastIndexOf("\\")+1);
		uploadedFiles.push('"'+filename+'":"'+fileRealName+'"');
		var tblrow = '<tr><td>'+filename+'</td><td>'+fileRealName+
		'</td><td>'+currentProjectName+'</td><td>Si</td>';
		$('#tblfiles > tbody:first').append(tblrow);
		//var jqXHR = $('#upload').submit();
	}
	
	//######### Global functions ############
	
	//Get HTML with Task Information
	var getTaskInfoHtml = function(data){
		var taskInfo = '<tr><td>ID: </td>'+
					   '<td>'+data.rprojectId+'</td></tr>'+
					   '<tr><td>Nombre: </td>'+
					   '<td>'+data.rprojectName+'</td></tr>'+
					   '<tr><td>Descripci&oacute;n: </td>'+
					   '<td>'+data.rprojectDesc+'</td></tr>'+
					   '<tr><td>Justificaci&oacute;n: </td>'+
					   '<td>'+data.rprojectJustify+'</td></tr>';
		return taskInfo;
	};
	
	//Present tasks list pages
	var loadTasks = function(e, loadPage, taskName){ 
		e.preventDefault();
		$("div.page-wrapper").load('templates/'+loadPage, function(e){
			lastLoadedTasks = loadPage;
			lastLoadedTasksName = taskName;
			var requestUrl = restUrl+"jbpm/tasks";
			ajaxGetRequest(requestUrl, function(data) {
				$.each(data, function(i, item) {
		    		var name = item.summary.name;
					if(taskName == name){
						var processInstanceId = item.content.rprojectId;
						var taskId = item.summary.id;
						var processName = item.content.rprojectName;
						var tblrow = '<tr><td id=task"'+taskId+'">'+taskId+'</td><td>'+processInstanceId+
									'</td><td>'+processName+'</td><td><Button class="showinfo" id="'+taskId+'">Ejecutar</Button></td>';
						$('#tbltasks > tbody:first').append(tblrow);
					}
				})
			})
		});
	}
	
	//###### Ajax Request Functions #########
	
	//Send Email
	var emailSend = function(name, to, subject, body, success){
		var requestUrl = restUrl+"mail/send";
		var json = '{"name":"'+name+'","to":"'+to+'","body":"'+body+'","subject":"'+subject+'","contentType":"text/html"}';
		ajaxPostRequest(requestUrl, json, function(data) {
			success(data);
		})
	}
	
	//Invoke GET Services
	var ajaxGetRequest = function(requestUrl, success){ 
		$.ajax({
		    url: requestUrl,
		    type: "GET",
		    contentType: "application/json",
		    success: function (data) {
		    	success(data);
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	MsgPop.open({
		          	  Type:  "error",
		          	  Content:errorThrown});
		    }
		});
	}
	
	var ajaxGetRequestWithCustomError = function(requestUrl, success, error){ 
		$.ajax({
		    url: requestUrl,
		    type: "GET",
		    contentType: "application/json",
		    success: function (data) {
		    	success(data);
		    },
		    statusCode: {
		        401: function() {
		          window.location.href="index.html";
		        }
		      },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	error(jqXHR, textStatus, errorThrown);
		    }
		});
	}
	
	//Invoke POST Services
	var ajaxPostRequest = function(requestUrl, json, success){ 
		$.ajax({
		    url: requestUrl,
		    type: 'POST',
		    contentType: "application/json",
		    data: json,
		    dataType: "json",
		    success: function (data) {
		    	success(data);
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	MsgPop.open({
		          	  Type:  "error",
		          	  Content:errorThrown});
		    }
		});
	}
	
	//Popup Window Configs
	MsgPop.displaySmall = true;
    MsgPop.position = "top-right";

	//Login Form color changes
	$(".user").focusin(function(){
		  $(".inputUserIcon").css("color", "#e74c3c");
		}).focusout(function(){
		  $(".inputUserIcon").css("color", "white");
		});

		$(".pass").focusin(function(){
		  $(".inputPassIcon").css("color", "#e74c3c");
		}).focusout(function(){
		  $(".inputPassIcon").css("color", "white");
	});
	
//	$('body').on('DOMNodeInserted', 'upload', function(e){
//		console.log("File Upload loaded")
//		bindFileUpload();
//	});
	
	//FileUpload JQuery
//	function bindFileUpload() {
//		$("#upload").fileupload({
//
//		  // This function is called when a file is added to the queue
//		  add: function (e, data) {
//		    //This area will contain file list and progress information.
//		    var tpl = $('<li class="working">'+
//		                '<input type="text" value="0" data-width="48" data-height="48" data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" />'+
//		                '<p></p><span></span></li>' );
//
//		    // Append the file name and file size
//		    tpl.find('p').text(data.files[0].name)
//		                 .append('<i>' + formatFileSize(data.files[0].size) + '</i>');
//
//		    // Add the HTML to the UL element
//		    data.context = tpl.appendTo(ul);
//
//		    // Initialize the knob plugin. This part can be ignored, if you are showing progress in some other way.
//		    tpl.find('input').knob();
//
//		    // Listen for clicks on the cancel icon
//		    tpl.find('span').click(function(){
//		      if(tpl.hasClass('working')){
//		              jqXHR.abort();
//		      }
//		      tpl.fadeOut(function(){
//		              tpl.remove();
//		      });
//		    });
//
//		    // Automatically upload the file once it is added to the queue
//		    var jqXHR = data.submit();
//		  },
//		  progress: function(e, data){
//
//		        // Calculate the completion percentage of the upload
//		        var progress = parseInt(data.loaded / data.total * 100, 10);
//
//		        // Update the hidden input field and trigger a change
//		        // so that the jQuery knob plugin knows to update the dial
//		        data.context.find('input').val(progress).change();
//
//		        if(progress == 100){
//		            data.context.removeClass('working');
//		        }
//		    }
//		});
//	};
//		//Helper function for calculation of progress
//		function formatFileSize(bytes) {
//		    if (typeof bytes !== 'number') {
//		        return '';
//		    }
//
//		    if (bytes >= 1000000000) {
//		        return (bytes / 1000000000).toFixed(2) + ' GB';
//		    }
//
//		    if (bytes >= 1000000) {
//		        return (bytes / 1000000).toFixed(2) + ' MB';
//		    }
//		    return (bytes / 1000).toFixed(2) + ' KB';
//		}
		  
});