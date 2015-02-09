##Steps for library developers
1. Install latest version of [node.js](http://nodejs.org/).
2. Clone this project repository.
3. Open the Command Prompt in Windows or Mac Terminal navigate to this project root directory.
4. Enter `npm install` which install all the build time required packages. It might requires Administrator privillage: on Mac `sudo npm install`, on windows run Command prompt in Adminidator mode.
5. Enter `grunt`. It should start a `localhost:9000` livereload session in your browser and watching the `src` and other files.
6. Open a new Command prompt or Terminal, and enter `grunt karma:it`. This starts [`Karam`](http://karma-runner.github.io/) test runner. It should launch several different browsers and start running the test cases in each of them. 
7. Now you are ready to write some code.

When releasing new version, use `grunt release:<patch, minor, major>`. It will run all the test, if they pass successfully then distribution files in *dist* folder will be generated and both `package.json` and `bower.json` will be auto updated.

##Steps for library consumers
You can clone the repository, the production ready files are in `dist` directory. The tagged version is more stable than `master`, `dev` branch is development branch which will break.

Or better, you can use `bower`.

## Brief introductions
#### Node.js
 **node.js** in nutshell is a JavaScript runtime environment based on Chrome V8, it provids us a way to do system calls using JavaScript.

#### Grunt
**Grunt** is a task runner, or in another word: a build tool. Just like `cmake` used in C, `Apache Ant` used in Java. This project uses it for project building purpose: concat files, produce source map, etc.

#### Bower
This is a package mangement tool for frontend developer. You can install this project via bower.

#### NPM
This is a default package managment tool for **node.js**. **Grunt** will be install via npm.

#### Why 2 package management tools?
**bower** manages your front-end application packages, e.g., your jquery, backbone.js, underscore.js. You can think of it as a replacement of you mannually downloading those javascript files. It is built with front-end development in mind.

**npm** actually is more related to build-time, compile-time. It is use for installing different build time node.js packages. Theses packages will help on file concatenation, dependency generation and source map generation, etc.

In bower, there is no nested dependencies. If your project require package A and package B, and they both require same version of jquery package, bower will only download A, B and **ONE** jquery package into the `bower_components` directory, if A and B requires exclusive version of jquery, bower will ask you to pick one. In npm however, it do heavy nesting dependencies. A and B will be in you project's `node_modules`, and there will be a jquery package in A and B's `node_modules`(even they require same version of jquery). It will be clearer, once you start using them.


## Dependency managment
This project **did not** use `requirejs`, which requires lots of configuration.

Instead, it uses a simple [dependency walker](https://www.npmjs.org/package/dependency-walker) to resolve dependency issues at build time.

You can specify the custom dependency statement, by default it is `require`. It uses these statement to do a topological sorting produce a list of files with correct sorted dependencies.

However, if you have circular dependencies in your code, it will throw an error. Try to avoid circular dependencies.

In the future, it is better to migrate to use [browserify](http://browserify.org/).

## Source map and dist directory
In `dist` directory, `inclusive.min.js` is the minified version, `*.map` is the corresponding companion source map file, which is used for web browser dev tool source code mapping, more information here: [JavaScript debugging](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps)

## Chrome Workspace
You can setup a [`Workspace`](https://developer.chrome.com/devtools/docs/workspaces) in Chrome, which helps the productivity.

1. Right click on `localhost:9000` in source tab of devtools.
2. Add folder to workspace. Click **add Folder to Workspace**. The folder should be added to the Chrome workspace.
3. Map files into local resources. Expand `localhost:9000`, right click any of the JavaScript file, add click `Map to File System Resource...`. Then choose the corresponding files in your local file system in the list.
4. Now your `localhost:9000` serverd files are mapped to the files on your local file system.

Since backslash path is not supported in google chrome workspace. You might need to fix your local version of `grunt-contrib-concat` package. Navigate to `node_modules/grunt-contrib-concat/tasks/lib/sourcemap.js`, find its `_dummyNode()` method, and add the code below to make sure back slash are properly replaced by forward slash.

```javascript
SourceMapConcatHelper.prototype._dummyNode = function(src, name) {
    var node = new SourceNode();
    var lineIndex = 1;
    var charIndex = 0;
    var tokens = src.split(/\b/g);

    // add this code to replace backslash with forward slash.
    if(name){
        name = name.replace(/\\/g, '/');
    }
    
    ...
```

## branchs
`dev` branch is on the edge development branch, update frequently and will break. `master` branch is relatively stable compare to `dev`, it will be merged with `dev` from time to time. If you looking a more stable branch, use master branch or the tags version.
