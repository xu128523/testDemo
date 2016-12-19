/**
 * 
 * @authors xuZhiQiang (xuzhiqiang928@tops001.com)
 * @date    2016-12-18 16:54:38
 * @version $Id$
 */
var myModule = angular.module("HelloAngualr", []);

myModule.controller("Angualr", ["$scope", 
	function HelloAngualr($scope){
		$scope.greeting = {
			text: "Hello"
		};
	}
]);
