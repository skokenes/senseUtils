var senseUtils = {
	destroyObj: function(app,qId) {
		app.model.session.socket.send(JSON.stringify({
			"jsonrpc": "2.0",
			"id": 2,
			"method": "DestroySessionObject",
			"handle": 1,
			"params": qId instanceof Array ? qId : [qId]
		}));
	},
	multiCube: function() {
		var app,
		 	cubes = [], 
		 	callback= function() {},
		 	queue;

		function multiCube() {

		}

		var queue = function () {
			var cube_status=0;
			cubes.forEach(function (d) {
				cube_status = cube_status + d.status; 
			});
			if(cube_status===cubes.length) {
				callback();
				cubes.forEach(function (d) {
					d.status = 0; 
				});
			}
		}

		multiCube.app  = function(_) {
			if (!arguments.length) return app;
	    	app = _;
	    	return multiCube;
		};

		multiCube.addCube = function(_) {
			if(!arguments.length) return null;
			var id = guid();
			cubes.push({id: id, def: _, status:0, data:null, qId:null});
			var currCube = getCubeObj(id);
			app.createCube(_, function(reply) {
				currCube.status = 1;
				currCube.data = reply;
				currCube.qId = reply.qInfo.qId;
				queue();
			});
			return multiCube;
		}

		multiCube.removeCube = function(_) {
			if(!arguments.length) return null;
			senseUtils.destroyObj(app,getCubeObj(_).qId);
			cubes = cubes.filter(function(d) {return d.id !=_});
		}

		multiCube.callback = function(_) {
			if(!arguments.length) return callback;
			callback = _;
			return multiCube;
		}

		multiCube.cubes = function() {
			return cubes;
		}

		multiCube.selfDestruct = function() {
			cubes.forEach(function(d) {
				senseUtils.destroyObj(app,d.qId);
			});
			app = null,
		 	cubes = [], 
		 	callback= function() {},
		 	queue = null;
		}

		var getCubeObj = function(guid) {

			var cubeObj;

			for (var i = 0; i<cubes.length; i++) {
				if (cubes[i].id===guid) {
					cubeObj = cubes[i]
					break;
				}
			}
			return cubeObj;

		}

		function guid() {
			  function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000)
			               .toString(16)
			               .substring(1);
			  }
			  return (function() {
			    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			           s4() + '-' + s4() + s4() + s4();
			  })();
		};

		return multiCube;

	}
};