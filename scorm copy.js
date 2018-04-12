// const scormObject = {};

// function getLessonDomain(callback) {
//
//   debug = 'y';
//
//   var lessonDomain = (window.location != window.parent.location)
//         ? document.referrer
//         : document.location;
//   if (debug == 'y') console.log('SCORM.JS LINE 6: original lessonDomain = ' + lessonDomain);
//   lessonDomain = getHostName(lessonDomain);
//   if (debug == 'y') console.log('SCORM.JS LINE 8: original hostname lessonDomain = ' + lessonDomain);
//
//   switch (lessonDomain) {
//     case "datest3":
//       lessonDomain = "https://demo.lmscourses.com/";
//       break;
//     case "dastaging1.driversalert.com":
//       lessonDomain = "https://demo.lmscourses.com/";
//       break;
//     case "datest10.driversalert.com":
//       lessonDomain = "https://demo.lmscourses.com/";
//       break;
//     case "demo.lmscourses.com":
//       lessonDomain = "https://demo.lmscourses.com/";
//       break;
//     case "secure.driversalert.com":
//       lessonDomain = "https://lessons.lmscourses.com/";
//       break;
//     case "cloud.scorm.com":
//       lessonDomain = "https://lessons.lmscourses.com/";
//       break;
//     case "undefined":
//       lessonDomain = "https://lessons.lmscourses.com/";
//       break;
//     default:
//       lessonDomain = "https://lessons.lmscourses.com/";
//       break;
//   }
//   if (debug == 'y') console.log('SCORM.JS LINE 23: new lessonDomain = ' + lessonDomain);
//
//   callback(lessonDomain);
//
// }

var lmsTarget = '*';

function sendPostMessage(scormFunction, scormCommand, scormValue, callback) {
	var debug = 'y';

	// make sure all the arguments have been passed in
	try {
		if (typeof scormFunction == 'undefined') throw 'scormFunction is empty';
		if (typeof scormCommand == 'undefined') throw 'scormCommand is empty';
		if (typeof scormValue == 'undefined') throw 'scormValue is empty';
	} catch (err) {
		return console.log('**ERROR SCORM.JS sendPostMessage: ' + err);
	}

	// send the message
	try {
		parent.postMessage(
			JSON.stringify({
				scormFunction: scormFunction,
				scormCommand: scormCommand,
				scormValue: scormValue
			}),
			'*'
		);
	} catch (err) {
		return console.log('**ERROR SCORM.JS ' + err);
	}

	if (typeof callback != 'undefined') {
		// Create IE + others compatible event handler
		var eventMethod = window.addEventListener
			? 'addEventListener'
			: 'attachEvent';
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
		var lessonLocation = '';
		var queryString = '';
		var userName = '';

		eventer(messageEvent, function(e) {
			console.log(
				'SCORM.JS LINE 52: parent received message and returned data: ',
				e.data
			);

			// if (e.origin !== lmsTarget) {
			//   alert('The domain of the parent does not match what the child thought it was going to be. Please contact your LMS administrator to report this error.');
			//   return;
			// }

			// read the message and parse to the correct variables
			msg = JSON.parse(e.data);

			switch (msg.variableName) {
				case 'lessonLocation':
					lessonLocation = msg.variableValue;
					if (debug == 'y')
						console.log(
							'SCORM.JS LINE 67: lessonLocation is ' + lessonLocation
						);
					callback(lessonLocation);
					break;
				case 'queryString':
					queryString = msg.variableValue;
					if (debug == 'y')
						console.log('SCORM.JS LINE 71: queryString is ' + queryString);
					callback(queryString);
					break;
				case 'userName':
					userName = msg.variableValue;
					if (debug == 'y')
						console.log('SCORM.JS LINE 75: userName is ' + userName);
					callback(userName);
					break;
				case 'studentid':
					studentid = msg.variableValue;
					if (debug == 'y')
						console.log(
							'SCORM.JS LINE imaginary NUMBER TEST: studentid is ' + studentid
						);
					callback(studentid);
					break;
				case 'allValues':
					allValues = msg.variableValue;
					if (debug == 'y') console.log('allValues is ' + allValues);
					callback(allValues);
					break;
				case 'returnURL':
					returnURL = msg.variableValue;
					if (debug == 'y')
						console.log('SCORM.JS LINE 109: returnURL is ' + returnURL);
					callback(returnURL);
					break;
				default:
					break;
			}
		});
	} // end typeof callback != 'undefined'
}

//

let studentid = 'No Set Yet';

// wait for studentid to be set Promise
// async function myFirstAsyncFunction() {
//   try {
//     const fulfilledValue = await promise;
//   }
//   catch (reject) {
//     console.log(reject);
//   }
// }

sendPostMessage('g_objAPI', 'LMSGetValue', 'cmi.core.student_id', function(
	studentid
) {
	console.log('Value Was Set Yo! ' + studentid);
});

var allValues;
var username;

sendPostMessage('g_objAPI', 'LMSGetValue', 'cmi.core.username', function(
	userName
) {
	console.log('Value Was Set Yo! ' + userName);
});

// const pullScorm = function(scormVars) {
// 	if (scormVars == 'undefined' || scormVars == '') {
// 		// Loop through all default values
// 	} else {
// 		for (var i = 0; i < scormVars.length; i++) {
// 			sendPostMessage(
// 				'g_objAPI',
// 				'LMSGetValue',
// 				'cmi.core.student_id',
// 				function(studentid) {
// 					console.log(studentid + '');
// 				}
// 			); // sendPostMessage END
// 		} // for END
// 	} // else END
// }; // pullScorm END
//
// console.log(studentid);
//
// let scormObject = new function() {
// 	this.studentid = studentid;
// 	this.score = '0.4';
// 	this.greet = 'Hello From Hell';
// 	this.string = 'Stay Positive';
// }();
//
// setTimeout(console.log(scormObject), 3000);
//
// /* ES5 */
// var isMomHappy = false;
// var changeHerMind = function() {
// 	var mood;
// 	if (isMomHappy) {
// 		isMomHappy = false;
// 		mood = 'You mader her upset';
// 	} else {
// 		isMomHappy = true;
// 		mood = 'You mader her Happy';
// 	}
// 	console.log('Her Mind Was Changed!!! ' + mood);
// };
//
// setTimeout(changeHerMind(), 10000);
//
// // Promise
// var getScormVale = new Promise(function(resolve, reject) {
// 	sendPostMessage();
// 	if (isMomHappy) {
// 		var phone = {
// 			brand: 'Samsung',
// 			color: 'black'
// 		};
// 		resolve(phone); // fulfilled
// 	} else {
// 		var reason = new Error('mom is not happy');
// 		reject(reason); // reject
// 	}
// });
//
// // call our promise
// var allScormValues = function() {
// 	willIGetNewPhone
// 		.then(function(fulfilled) {
// 			// yay, you got a new phone
// 			console.log(fulfilled);
// 			// output: { brand: 'Samsung', color: 'black' }
// 		})
// 		.catch(function(error) {
// 			// oops, mom don't buy it
// 			console.log(error.message);
// 			// output: 'mom is not happy'
// 		});
// };
//
// askMom();
//
// // setTimeout(changeHerMind(), 4000);
// //
// // askMom();
