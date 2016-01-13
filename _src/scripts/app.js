$(function() {

    $window = $(window);
    $chart = $('#chart');
    $tableContainer = $('#table');
    staff = App.staff;
    disciplines = App.disciplines;
    colors = App.colors;
    tasks = [];
    projects = [];
    jsonobject = [];

    App.source.getProjects(function(resp) {
        projects = resp;
        App.gantt.addProjects(projects);
    });
    App.source.getTasks(function(resp) {
        $.each(resp, function(i, obj) {
            if(obj.hours_user > 0) {
                tasks.push(obj);
            }
        });
    });

    App.gantt.init();

});