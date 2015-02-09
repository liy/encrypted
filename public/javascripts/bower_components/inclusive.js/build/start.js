// inclusive package
var inclusive = window.inclusive = window.inclusive || Object.create(null);

var require = inclusive.require = function(path, moduleName){
  // if file contains multiple modules
  if(moduleName){
    return inclusive[moduleName];
  }

  var index = path.lastIndexOf('/');
  index = (index === -1) ? 0 : index+1;
  var fileName = path.substr(index);

  var className = fileName.split('.')[0];

  return inclusive[className];
};