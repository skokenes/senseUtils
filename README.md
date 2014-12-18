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
senseUtils.destroyObj(app,qId); // removes a transient object like a mashup-defined hypercube
```

Function Overview
--
**destroyObj**(_app,qId_)

destroyObj takes in a reference to an application opened with the Qlik Sense Workbench API and the qId of a transient object and removes it. This function is useful in mashups when a hypercube is no longer needed and can be removed. _qId_ can also be an array of qId's as strings; in this case, it will remove all the objects in the array from the server.

**filterPanel**()

filterPanel creates a custom, collapsible set of list boxes. After defining a Qlik Sense application and a parent element to append to, the filterPanel can easily add or remove filters. CSS can be used to apply custom styles to the filters. To create a new filterPanel:

```
var filterPanel = senseUtils.filterPanel(); // creates a new, empty filterPanel
```

[A live example with formatting can be demoed here.](http://sense.axisgroup.com/extensions/filterpanel/filterpanel.html)

filterPanel.**app**(_[app]_)

The app() method takes in a reference to an application opened with the Qlik Sense Workbench API. This application is used for all filters created in the filterPanel. If no parameter is entered, the method returns the filterPanel's application.

filterPanel.**container**(_[container]_)

The container() method takes in a reference to an element on the page which the filterPanel will occupy. The container should be entered as a string, like "#id". If no parameter is entered, the method returns the current container value.

filterPanel.**addFields**(_array_)

The addFields() method takes in an array of field names and creates the filters for them. The input can be defined in two formats:

1. An array of strings representing the field names.
   ex: ["Region","Country"]
2. An array of objects with properties "name" and "title". The name property represents the name of the field in the data model, while the title property represents a front-end title for the filterPanel UI.
   ex: [{ name:"Region", title:"Reg" }, { name:"Country", title:"Ctry" }]

filterPanel.**removeField**(_string_)

The removeField() method takes in a string representing a field name. This field will be removed from the filterPanel.

filterPanel.**fields**()

The fields() method returns an array of the active fields in the filterPanel. This array includes state counts and filter values.

filterPanel.**badges**(_[bool]_)

The badges() method takes in a boolean value that determines whether to display badges with selection counts for each field. By default, the value is true. If no parameter is entered, the method returns the current value.

filterPanel.**autoCollapse**(_[bool]_)

The autoCollapse() method takes in a boolean value that determines whether filters should auto-collapse when other filters are activated. The default value is true. If no parameter is entered, the method returns the current value.

**filterPanel styling**

In order for the filterPanel to properly work, the _filter-panel.css_ file in this repository should be included. This css file can be modified to customize the style of the filterPanel further. This file should be used as a starting point however as it contains CSS that controls the collapsing functionality.

**filterPanel example**

An example use of the filterPanel:
```
app; // assume a Qlik Sense app object exists in this variable

var filterPanel = senseUtils.filterPanel()                      // creates a new filterPanel
                            .app(app)                           // sets the 
                            .container("#filter_container")     // sets an element with id "#filter_container" as the parent
                            .addFields(["Region","Country"]);   // adds the fields Region and Country to the panel

filterPanel.badges(false); // disables badges

filterPanel.removeField("Region") // removes the Region filter from the panel
```

**flattenPages**(layout.qHyperCube.qDataPages)

This is a function that accepts the set of qDataPages from the qHyperCube and returns a qMatrix containing all of the data from all of the pages.

Example:

```
var bigMatrix = []; //array object to hold the full data set

//use flattenPages function to create large master qMatrix

bigMatrix = senseUtils.flattenPages(_[qDataPages Object]_);  //pass in the qDataPages object

```

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

**pageExtensionData**(_this,extension DOM element,layout object,callbackFunction_)

**_--Extensions-only--_**

This function is meant to enable extension developers to retrieve larger data sets for their extension objects.  Currently the limit for extensions is 10,000 cells of data, so if your data has one dimension and one measure (2 columns), you can only retrieve 5000 rows (10,000/2).  Once this limit is reached, the data needs to be paged to retrieve the full set.  This function will page the data and return (to a callback function defined by you), a flattened matrix of data from Sense.

Generally, the way this function works is that you pass several parameters (that are available in paint) into the function along with a callback function that you create yourself to use the actual dataset to draw a viz or something similar.  The dataPage function will page through all of the data, and when finished, it will fire off the callback function that you have defined.  Your callback function is essentially replacing the paint function that you're probably familiar with.  Thus, if you're wanting to convert an extension over to using getData, you'd move all of the code from within paint into a new callback function and leverage the new flattened dataset.  This callback function will need to be formatted properly to accept the data, so please see below.

Please see the updated [Sunburst Extension](http://branch.qlik.com/projects/showthread.php?178-Zoomable-Sunburst-with-D3&highlight=sunburst) as an example of its use.


The parameters needed for dataPage are:

_this_ : reference to the current extension object as defined in Sense.  In plain words, there are several functions that need "this" in order to run them (such at making selections), so it may be something you need to pass into the callback function.  Also, it is needed in order to use the backendApi to page the data.

_extension DOM element_ : this is the reference to the actual DOM element for the extension object.  It's needed to do just about anything you'd want to do in terms of creating viz in an extension.

_layout object_ : this is the object passed in to the extension from sense which contains such important things as the qHyperCube, qSelectionInfo, etc.  

_callbackFunction_ : this is the name of the function that you've made which will use the full data set.

The callback function needs to be formatted in the following way to accept the data.  it is similar to the parameters to the standard paint function, but with the addition of the flattened data.


```
function callbackExample(element, layout object, flattened data matrix, [this]){
```


In the paint function for most extensions, the element and layout object are included first, so this should make it easier to convert over your extensions to use the paging.  Simply name the element and layout objects the same as you named them for the paint function.

The flattened data matrix is the qMatrix object containing the full data set.  So in many extensions, there is this code to get the qMatrix (with one page of data):


```
var qData = layout.qHyperCube.qDataPages[0];

var qMatrix = qData.qMatrix;
```


With this new full matrix being returned, the code above can be replaced with this:


```
var qMatrix = [flattened data matrix]  //whatever you've named that param in the call back
```

Again, please take a look at the [Sunburst Extension](http://branch.qlik.com/projects/showthread.php?178-Zoomable-Sunburst-with-D3&highlight=sunburst) to see an example.

