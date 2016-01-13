App.gantt = (function() {

    // var feed = 'list'; // cells
    // var key = '1iwcJceh6HoX6p56pJiPenCjySd2tz4EuQTFdotP6EIE';
    // var worksheet = 'abbvie'; // '709666500'

    // var url = 'https://spreadsheets.google.com/feeds/worksheets/'+key+'/public/full?alt=json';

    var $svg,
        svg,
        aantalWeken,
        chartData,
        eersteWeek,
        laatsteWeek,
        personen = [],
        selectedProject,
        svgHeight,
        svgWidth,
        weeksRange,
        showGrid = false,
        width;


    function init() {

        svg = d3.select('#chart')
            .append('svg')
            .attr({
                'class':'chart',
                'width':'80%',
                'height':'80%'
            });

        controls();

    }

    function getProjectTasks(projectid) {

        var taken = [];
        $.each(tasks, function(i, obj) {
            if(parseInt(obj.project_id,10) === projectid) {
                taken.push(obj);
            }
        });
        return taken;
        // return _.where(tasks, {'project_id': projectid});

    }

    function addProjects(_data) {

        $projects = $('#projects');

        var data = _.sortBy(_data, 'Naam');

        $.each(data, function(i, obj) {


            if(obj) {
                var title = obj.Naam || '';
                var account = obj.account_name || '';
                var link = obj.id;
                var $view = $('<div/>', {'class':'col-sm-3'}).append(
                    $('<div/>', {'class':'checkbox'}).append(
                        $('<label/>', {'class':'project-label'}).append(
                            $('<input/>', {
                                'type':'checkbox',
                                'name':'projects',
                                'data-project': link
                            }).val(link),
                            $('<span/>').css({
                                'background-color': colors[link]
                            }),
                            title
                        )
                    )
                );

                $(document).on('updateProjectList', function(event, data){
                    if(
                        (title.toLowerCase()).indexOf(data.toLowerCase()) !== -1 ||
                        (account.toLowerCase()).indexOf(data.toLowerCase()) !== -1

                    ) {
                        $view.show();
                    } else {
                        $view.hide();
                    }
                });

                $projects.append($view);

            }

        });

        $('#show-projects').on('click', function() {

            var $inputs = $('input[name="projects"]');
            var projects = [];
            $inputs.each(function() {
                var $this = $(this);
                if($this.prop('checked')) {
                    projects.push(parseInt($this.val(), 10));
                }
            });

            var data = [];

            $.each(projects, function(i, projectid) {
                var projects = getProjectTasks(projectid);
                data = data.concat(projects);
            });
            
            buildGantt(data);
        });
         
        $('#search-projects').on('keyup', function() {
            $(document).trigger('updateProjectList', $(this).val());
        });

    }

    function buildGantt(_hours) {

        reset();

        var chartData = _hours;

        $svg            = $('#chart').find('.chart').first();
        svgHeight       = $svg.outerHeight();
        svgWidth        = $svg.outerWidth();

        // Create date objects from the week and year number that are given. 
        var dates = _.map(chartData, function(obj) {
            var week = (obj.week < 10) ? '0'+obj.week : obj.week;
            return moment(obj.year + '-W' + week+'-1');
        });

        // Sort the dates we found in the data. 
        dates = _.sortBy(dates, function(date) {
            return date.unix();
        });

        // find the first and last date, and calculate the total duration. 
        eersteWeek = dates[0];
        laatsteWeek = dates[dates.length - 1];
        aantalWeken = Math.round((laatsteWeek.unix() - eersteWeek.unix()) / (60 * 60 * 24 * 7));

        // Create an array with all the weeks in the scope
        weeksRange = [];
        for (i = 0; i < aantalWeken; i++) {
            weeksRange.push(((eersteWeek.get('week') + i) % 52) + 1);
        }
        
        // persons of the y axis
        var _personen = _.uniq(_.pluck(chartData, 'user_id'));
        _.each(_personen, function(obj, i) {
            if(staff[obj]) {
                personen.push(staff[obj]);
            } else {
                console.log('undefined in staff: ', obj);
            }
        });
        personen = _.sortBy(personen, 'order');

        // width scale for the x axis
        width = d3.scale.linear()
            .domain([0, aantalWeken])
            .range(weeksRange);

        // Create the chart
        svg.selectAll('rect')
            .data(chartData)
            .enter().append('rect')
            .style({
                'opacity':'0.8'
            })
            .attr({
                'data-project': function(d) {
                    return d.project_id;
                },
                'data-task': function(d) {
                    return JSON.stringify(d);
                },
                'class': function(d) {
                    return staff[d.user_id].discipline + ' p'+d.project_id;
                },
                'stroke-width': 2,
                width: function(d) {
                    var width;
                    if(d.hours_user === 0 ) {
                        width = 0;
                    } else {
                        width = (d.hours_user / 40) * (100 / aantalWeken);
                    }
                    return (width < 0.4) ? '0.4%' : width+'%';
                },
                height: function(d) {
                    return svgHeight / personen.length;
                },
                x: function(d) {
                    var step = 100 / aantalWeken;
                    var week = (d.week < 10) ?
                        moment(d.year + '-W0' + d.week + '-1'):
                        moment(d.year + '-W' + d.week + '-1');

                    return ( week.unix() - eersteWeek.unix() ) / ( Math.round(3600 * 7 * 24) ) * step + '%';
                },
                y: function(d, i) {
                    var y = svgHeight / personen.length;
                    var position = _.findIndex(personen, function(person) {
                        return parseInt(person.id, 10) === parseInt(d.user_id, 10);
                    });
                    return position * y;
                },
                stroke: function(d) {
                    return '#f2f2f2';
                },
                fill: function(d) {
                    return getColor(d);
                }
            });

        buildXAxis(chartData);
        buildYAxis(chartData);

        chartEvents();
        renderGrid();

    }

    function buildXAxis(hours) {

        var startWeek = moment.unix(eersteWeek.unix());

        svg.selectAll(".weeknumber")
            .data(weeksRange)
          .enter().append("text")
            .attr({
                'class': 'weeknumber',
                'text-anchor': 'middle',
                x: function(weeknumber) {

                    startWeek = startWeek.add(1, 'week');


                    // var x = _.findIndex(weeksRange, function(obj) {
                    //     return obj === weeknumber;
                    // });
                    var x = (startWeek.unix() - eersteWeek.unix()) / (3600 * 24 * 7);
                    var step = $svg.outerWidth() / aantalWeken;

                    return (x*step) + (step / 2);
                },
                y: svgHeight + 20,
                dy: ".71em"
            })
            .text(function(weeknumber) {
                return weeknumber;
            });

    }


    function buildYAxis(hours) {

        var y = d3.scale.linear()
            .domain([
                0,
                personen.length
            ])
            .range([
                0,
                svgHeight
            ]);

        var labelsY = [];
        _.each(personen, function(person) {
            labelsY.push(person);
        });
        labelsY = _.sortBy(labelsY, 'order');

        svg.selectAll(".member")
            .data(labelsY)
          .enter().append("text")
            .attr({
                'class': 'member',
                'text-anchor': 'end',
                y: function(member, i) {
                    return y(i) + svgHeight / personen.length / 2;
                },
                x: -50,
                dy: ".71em"
            })
            .text(function(member) {
                var name = (member) ? member.name : 'Onbekend';
                return name;
            });

    }

    function renderResults(value) {

        $.ajax({
            url: value + '?alt=json',
            type: 'GET',
            success: function(resp) {
                var table = [];
                $.each(resp.feed.entry, function(i, obj) {
                    table.push({
                        besteed: parseInt(obj.gsx$besteed.$t,10),
                        gepland: parseInt(obj.gsx$gepland.$t,10),
                        member: obj.gsx$member.$t,
                        status: obj.gsx$status.$t,
                        title: obj.gsx$title.$t,
                        week: parseInt(obj.gsx$week.$t,10),
                        year: parseInt(obj.gsx$year.$t,10)
                    });
                });
                buildGantt(table);
            }
        });

    }

    function renderGrid() {

        var gridData = [];

        for (var i = personen.length - 1; i >= 0; i--) {
            var Ystep = svgHeight / personen.length;
            gridData.push({
                x1: 0,
                y1: Ystep * i,
                x2: $svg.outerWidth(),
                y2: Ystep * i
            });
        }

        for (var ii = aantalWeken - 1; ii >= 0; ii--) {
            var Xstep = svgWidth / aantalWeken;
            var line = {
                x1: Xstep * ii,
                y1: 0,
                x2: Xstep * ii,
                y2: svgHeight
            };
            gridData.push(line);
        }

        var grid = svg.append('g')
            .attr({
                'class':'grid'
            })
            .style({
                opacity: function() {
                    return (showGrid) ? '1': '0';
                }
            });

        grid.selectAll('line')
            .data(gridData)
            .enter().append('line')
            .attr({
                x1: function(d) {
                    return d.x1;
                },
                y1: function(d) {
                    return d.y1;
                },
                x2: function(d) {
                    return d.x2;
                },
                y2: function(d) {
                    return d.y2;
                },
                'stroke-width': 1,
                'stroke':'#ddd'
            });

        // x: function(d) {
        //     var step = 100 / aantalWeken;
        //     var week = (d.week < 10) ?
        //         moment(d.year + '-W0' + d.week + '-1'):
        //         moment(d.year + '-W' + d.week + '-1');

        //     return ( week.unix() - eersteWeek.unix() ) / ( Math.round(3600 * 7 * 24) ) * step + '%';
        // },
        // y: function(d, i) {
        //     var y = svgHeight / personen.length;
        //     var position = _.findIndex(personen, function(person) {
        //         return person.name.toLowerCase() === d.member.toLowerCase();
        //     });
        //     return position * y;
        // },


    }

    function reset() {

        d3.select("svg").remove();
        svg = d3.select('#chart')
            .append('svg')
            .attr({
                'class':'chart',
                'width':'80%',
                'height':'80%'
            });
        personen = [];

    }

    function controls() {

        $('#toggle-grid').on('change', function(event) {
            event.stopPropagation();
            console.log(event, $(this));

            if($(this).is(':checked')) {
                showGrid = true;
                $('.grid').css('opacity', 1);
            } else {
                showGrid = false;
                $('.grid').css('opacity', 0);
            }
        });

        $('#reset').on('click', function() {
            $('input:checked').prop('checked', false);
        });
    }

    function chartEvents() {

        $('rect').hover(function(event) {
            // console.log( $(this).attr('data-task') );
            // console.log(JSON.parse($(this).attr('data-task')));
            var info = JSON.parse($(this).attr('data-task'));
            $('#hover')
                .css({
                    left: event.clientX,
                    top: event.clientY
                })
                .show();
            // $('#account_id').html(info.account_id);
            // $('#billabletype_id').html(info.billabletype_id);
            // $('#billed').html(info.billed);
            $('#createdby').html(App.staff[info.createdby]);
            $('#createdon').html(info.createdon);
            $('#declaration_id').html(info.declaration_id);
            $('#discipline_id').html(info.discipline_id);
            $('#discipline_name').html(info.discipline_name);
            $('#hours').html(info.hours);
            $('#hours_user').html(info.hours_user);
            // $('#id').html(info.id);
            $('#name').html(info.name);
            $('#percentage_left').html(info.percentage_left);
            $('#project_id').html(info.project_id + ': '+ info.project_name);
            // $('#project_name').html(info.project_name);
            $('#status_id').html(info.status_id);
            $('#status_name').html(info.status_name);
            $('#user_id').html(info.user_id);
            $('#week').html(info.week);
            $('#year').html(info.year);

            $('.'+$(this).attr('data-project')).css('opacity', '1');
        }, function() {
            $('#hover').hide();
            $('.'+$(this).attr('data-project')).css('opacity', '0.8');
        });

        $('rect').on('click', function(event) {
            selectedProject = $(this).attr('data-project');
            if(event.shiftKey) {
                fillColor('project', selectedProject);
            } else {
                fillColor('discipline', selectedProject);
            }
        });

        // $('#colors').on('change', function() {

        //     switch($(this).val()) {
        //         case 'discipline':

        //             d3.selectAll('.IO').style('fill', green);
        //             d3.selectAll('.VD').style('fill', yellow);
        //             d3.selectAll('.FE').style('fill', red);
        //             d3.selectAll('.BE').style('fill', d3.rgb.darker(blue));
        //             d3.selectAll('.Content').style('fill', purple);

        //             break;
        //         case 'project':
        //             // for each project
        //             break;
        //     }
        // });
    }

    function getColor(d) {

        var projectColor = colors[d.project_id] || '#ccc';
        var colorBase = d3.rgb(projectColor);
        var color = '#ccc';

        switch(staff[d.user_id].discipline) {
            case 'IO':
                color = colorBase.brighter(2).toString();
                break;
            case 'VD':
                color = colorBase.brighter().toString();
                break;
            case 'FE':
                color = colorBase;
                break;
            case 'BE':
                color = colorBase.darker().toString();
                break;
            case 'Content':
                color = colorBase.darker(2).toString();
                break;
            default:
                color = 'pink';
                break;
        }
        return color;

    }

    function fillColor(type, project) {

        if(type === 'project') {
            d3.selectAll('.p'+project)
                .style('fill',  function(d) {
                    return getColor(d);
                });

        } else if(type === 'discipline') {

            d3.selectAll('.IO.p'+project).style('fill', green);
            d3.selectAll('.VD.p'+project).style('fill', yellow);
            d3.selectAll('.FE.p'+project).style('fill', red);
            d3.selectAll('.BE.p'+project).style('fill', blue);
            d3.selectAll('.Content.p'+project).style('fill', purple);

        } else {
            // what else?
        }

    }

    return {
        init: init,
        buildGantt: buildGantt,
        addProjects: addProjects
    };

})();