var REST_API = "http://127.0.0.1:5000/api/v1.0";

function load_task_list(f_div){
    var ul = f_div.find("ul");
    if(ul)
        ul.remove()
    f_div.html("<ul class='list-group'></ul>");
    ul = f_div.find("ul");

    $.getJSON(REST_API+"/tasks", function (data){
        var tasks = data["tasks"]; //dictionary from JSON
        for(var index in tasks){
            if(tasks[index].urgent == 1)
                ul.append(
                    "<li class='list-group-item list-group-item-danger form-inline'>" +
                    tasks[index].description +
                    "<button class='btn btn-default' onclick='updateTask("
                    + tasks[index].id + ',"'+ tasks[index].description +'",1' +")' style='margin-left: 8px; '>Update</button>" +
                    "<a href='' onclick='deleteTask(" +
                    tasks[index].id +
                    ")'><img src='/static/x-button.png' alt='Delete' style='margin-left: 8px;'></a>" +
                    "</li>"
                );
            else
                ul.append(
                    "<li class='list-group-item list-group-item-info form-inline'>" +
                    tasks[index].description +
                    "<button class='btn btn-default' onclick='updateTask("
                    + tasks[index].id + ',"'+ tasks[index].description +'",0' +")' style='margin-left: 8px; '>Update</button>" +
                    "<a href='' onclick='deleteTask(" +
                    tasks[index].id +
                    ")'><img src='/static/x-button.png' alt='Delete' style='margin-left: 8px;'></a>" +
                    "</li>"
                );
        }
    });
}

function addTask(){
    var description = $("#taskDescription").val() ;
    var urgent = $("#taskUrgent").is(":checked");
    var task = {"description": description, "urgent": urgent ? 1:0};
    var json = JSON.stringify(task);

    $.post({
        "url": REST_API + "/tasks",
        "data": json,
        "contentType": "application/json",
        "success": function (){
            load_task_list($("#tasklist"));
            $("#taskDescription").val("");
            var box = $("#taskUrgent");
            if(box.is(":checked"))
                box.prop("checked",false);
        }
    })
}

function deleteTask(task_id){
    $.ajax(
        {
            method: "DELETE",
            url: REST_API+ "/tasks/" + task_id,
            success: function (){load_task_list($("#tasklist"))}
        });
}

function updateTask(task_id, description, urgent){
    $("#taskDescription").val(description);
    if(urgent == 1)
        $("#taskUrgent").prop("checked",true);
    else $("#taskUrgent").prop("checked", false);

    $("#addForm").method = "PUT"
    $("#addForm").unbind();
    $("#addTask").text("Update");
    $("#addForm").submit(function (e) {
        var urgent = $("#taskUrgent").is(":checked") ? 1:0;
        var descr = $("#taskDescription").val();
        var task = {"description": descr, "urgent": urgent};
        var json = JSON.stringify(task);
        $.ajax({
            method: "PUT",
            url: REST_API + "/tasks/" + task_id,
            data: json,
            contentType: "application/json",
            success: function(){
                load_task_list($("#tasklist"));
                $("#addTask").text("Add");
                $("#taskDescription").val("");
                $("#addForm").method = "POST";
                $("#addForm").unbind().submit(function (e) {
                    addTask();
                    return false;
                });
            }
        });
        return false;
    });
}

$(document).ready(function () {
   load_task_list($("#tasklist"));

   $("#addForm").submit(function () {
       addTask();
       return false;
   });
});