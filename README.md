senseUtils
=========

senseUtils is a Javascript library that extends the Qlik Sense APIs. It provides users with methods to better integrate and manage custom Qlik Sense web solutions such as extensions or mashups.

Installation and Use
------------
senseUtils can be incorporated into a project by loading in the JavaScript file. For a mashup, this could be loaded in the HTML header:

```
<script src="senseUtils.js"></script>
```
It could also be used in a define() or require() statement, which is common for mashups and extensions. An example extension instatiation:
```
define(["jquery", "text!./style.css","./senseD3utils"], function($, cssContent) {
```

Once the library is loaded, the functions can be called against the senseUtils namespace:
```
senseUtils; // the library namespace
senseUtils.destroyCube(app,qId); // removes a hypercube
```

Function Overview
--
**destroyObj**(_app,qId_)

destroyCube takes in a reference to an application opened with the Qlik Sense Workbench API and the qId of a transient object and removes it. This function is useful in mashups when a hypercube is no longer needed and can be removed. 

**multiCube**()

multiCube() creates a new multiCube object. The multiCube object provides functions to link multiple hypercubes together and execute one callback once all hypercubes have updated their data. This is useful for complex visualizations that may require data from multiple cubes to render. The multiCube's setters return the multiCube, so they can be chained when configuring the cube. The multiCube methods are detailed below. To create a new multiCube:
```
var myCube = senseUtils.multiCube(); // creates a new, empty multiCube
```

multiCube.**app**(_[app]_)

The app() parameter takes in a reference to an application opened with the Qlik Sense Workbench API. This application is used for all hypercubes that are created within the multiCube. If no parameter is entered, the function returns the multiCube's current application.

multiCube.**addCube**(_def_)

addCube() takes the json definition of a hypercube and creates it in the multiCube's previously defined app. The multiCube keeps track of all cubes defined this way and their data, so multiple cubes can be added with this method.

multiCube.**removeCube**(_id_)

removeCube() takes the id of a cube and removes it from the multiCube. This removal includes removing the hypercube object from the server. The id can be retrieved from the cubes() object array.

multiCube.**cubes**()

cubes() returns an object array containing a list of the cubes that have been added. Each cube's object contains the following properties:

- id: a unique identifier for the cube within the multiCube
- qId: the qId of the cube's object on the server
- data: the data sent back from the server every time the cube's callback is executed
- status: an internal parameter for keeping track of cube update status

multiCube.**callback**(_[func]_)

callback() sets the function that will be called everytime all the cubes in a multiCube have finished updating their data. If a parameter is not defined, it will return the current callback function.

multiCube.**selfDestruct**()

selfDestruct() removes all of the hypercube objects from the server and resets the multiCube to be empty. This includes removing the app reference, cubes, and callback function.

**multiCube example**

Here is an example of how you might use a multiCube:
```
// assume an application has already been opened with the API
app; 

// define the first cube
var cube1_def = {
        			qDimensions : [
        				{ qDef : {qFieldDefs : ["Dim1"]}}
        			], 
        			qMeasures : [
        				{ qDef : {qDef : "Sum([Expression1])", qLabel :""}}
        			],
        			qInitialDataFetch: [{qHeight: 20,qWidth: 4}]
        		};
        		
// define the second cube
var cube2_def = {
        			qDimensions : [
        				{ qDef : {qFieldDefs : ["Dim1"]}}
        			], 
        			qMeasures : [
        				{ qDef : {qDef : "Sum([Expression1])", qLabel :""}}
        			],
        			qInitialDataFetch: [{qHeight: 20,qWidth: 4}]
        		};
        		
// define a callback function; this function will only run once all cubes have retrieved their data
var viz = function() {
            var cube1_data = myCube.cubes()[0].data; // get the first cubes data
            var cube2_data = myCube.cubes()[1].data; // get the second cubes data
            // do something with the data here //
        };

// create the multiCube
var myCube = senseUtils.multiCube()
                .app(app)               // set the app
                .callback(viz)          // set the callback
                .addCube(cube1_def)     // create the first cube
                .addCube(cube2_def);    // create the second cube
                
// get the first cube object within the multiCube
var firstCube = myCube.cubes()[0];

// remove the first cube object from the multiCube
myCube.removeCube(firstCube.id);

// remove the entire multiCube
myCube.selfDestruct();
```
While explicitly designed for handling multiple cubes at once, the multiCube() function can be useful for a single cube as well. For example, it provides easily referencable methods for removing a cube or updating it's callback function after it was initially defined.