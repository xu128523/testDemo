/**
 * 
 * @authors xuZhiQiang (xuzhiqiang928@tops001.com)
 * @date    2016-12-18 16:54:38
 * @version $Id$
 */

var myModule = angular.module("MyModule", []);

myModule.directive("hello",  function(){
	return {
		restrict: "E",
		template: "<div>Hi everyone!</div>",
		replace: true
	}
});

