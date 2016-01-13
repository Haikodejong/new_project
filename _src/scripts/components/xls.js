App.source = (function() {

    function init() {


    }

    function getProjects(callback) {

        var url = "/projects.xls";
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function(e) {
            var arraybuffer = oReq.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLS */
            var workbook = XLS.read(bstr, {
                type:"binary"
            });


            // console.log('projects', XLS.utils.sheet_to_json(workbook.Sheets['projecten.xls']));
            if(callback) callback(XLS.utils.sheet_to_json(workbook.Sheets['projecten.xls']));

        };

        oReq.send();

    }

    function getTasks(callback) {

        var url = "/taken.xls";
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function(e) {
            var arraybuffer = oReq.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLS */
            var workbook = XLS.read(bstr, {
                type:"binary"
            });

            // console.log('tasks', XLS.utils.sheet_to_json(workbook.Sheets['taken']));
            if(callback) callback(XLS.utils.sheet_to_json(workbook.Sheets['taken']));

            // console.log(workbook);
            // var source = workbook.Sheets['taken'];
            // console.table(source);
            // console.table(source);
            // console.log(XLS.utils.sheet_to_json(source));
            // App.bron(XLS.utils.sheet_to_json(source));

        };

        oReq.send();

    }

    return {
        init: init,
        getProjects: getProjects,
        getTasks: getTasks
    };

})();