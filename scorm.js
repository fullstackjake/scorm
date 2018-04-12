// Default Values
var scormFun = new Object(),
	scoreSummary = new Object(),
	studentid = 'Studentid Not Set Yet',
	queryString = 'queryString Not Set Yet';

//Magic Start
// Getting Values from parent IFRAME
var parentCommGet = function(scormTask, lmsTarget) {
	if (scormTask == null || scormTask == false) {
		scormTask = 'cmi.core.student_id';
	}
	if (lmsTarget == typeof 'undefined' || lmsTarget == null || lmsTarget == '') {
		lmsTarget = '*';
		console.log("lmsTarget was empty. Set to '*', please fix");
		// alert('Please contact your lms administrator!');
	}

	try {
		parent.postMessage(
			JSON.stringify({
				scormFunction: 'g_objAPI',
				scormCommand: 'LMSGetValue',
				scormValue: scormTask
			}),
			lmsTarget
		);
	} catch (err) {
		return console.log('**ERROR SCORM.JS ' + err);
	}
	return console.log('The scorm value requested was: ' + scormTask);
};

// ###########################################################
// Sending Values to parent
var parentCommSend = function(scormValue, scormTask, lmsTarget) {
	if (scormTask == null || scormTask == false) {
		scormTask = 'cmi.suspend_data';
	}

	if (lmsTarget == typeof 'undefined' || lmsTarget == null || lmsTarget == '') {
		lmsTarget = '*';
		console.log("lmsTarget was empty. Set to '*', please fix");
	}

	try {
		parent.postMessage(
			JSON.stringify({
				scormFunction: 'lesson_DoFSCommand',
				scormCommand: 'LMSSetValue',
				scormValue: scormTask + ', ' + scormValue
			}),
			lmsTarget
		);
	} catch (err) {
		return console.log('**ERROR SCORM.JS ' + err);
	}
	return console.log(
		'The scorm value update was: ' + scormTask + ': ' + scormValue
	);
};

// ###########################################################
// Scoring
var parentCommScore = function(
	passingGrade,
	totalQuestions,
	totalCorrect,
	lmsTarget
) {
	if (lmsTarget.indexOf('secure.driversalert') !== -1) {
		console.log('YO WE ARE IN SECURE.DRIVERSALERT');
	} else {
		if (
			lmsTarget == typeof 'undefined' ||
			lmsTarget == null ||
			lmsTarget == ''
		) {
			lmsTarget = '*';
			console.log("lmsTarget was empty. Set to '*', please fix");
		}

		if (totalCorrect == 0) {
			var studentScoreScaled = 0;
			var studentScore = 0;
		} else {
			var studentScoreScaled = totalCorrect / totalQuestions;
			var studentScore = Math.floor(studentScoreScaled * 100);
		}

		if (studentScore >= passingGrade) {
			var testStatus = 'passed';
			var lessonStatus = 'cmi.success_status,passed';
			var coreLessonStatus = 'cmi.core.lesson_status,passed';
			var coreLessonCompletion = 'cmi.core.lesson_status,completed';
			console.log('We passed yo');
		} else {
			var testStatus = 'failed';
			var lessonStatus = 'cmi.success_status,failed';
			var coreLessonStatus = 'cmi.core.lesson_status,failed';
			var coreLessonCompletion = 'cmi.core.lesson_status,incomplete';
			console.log('We failed brah');
		}

		try {
			// if (testStatus == 'passed') {
			// 	parent.postMessage(
			// 		JSON.stringify({
			// 			scormFunction: 'lesson_DoFSCommand',
			// 			scormCommand: 'LMSSetValue',
			// 			scormValue: 'cmi.completion_status,completed'
			// 		}),
			// 		lmsTarget
			// 	);
			// }
			// parent.postMessage(
			// 	JSON.stringify({
			// 		scormFunction: 'lesson_DoFSCommand',
			// 		scormCommand: 'LMSSetValue',
			// 		scormValue: lessonStatus
			// 	}),
			// 	lmsTarget
			// );

			console.log(coreLessonStatus);
			parent.postMessage(
				JSON.stringify({
					scormFunction: 'lesson_DoFSCommand',
					scormCommand: 'LMSSetValue',
					scormValue: 'cmi.core.score.min,0'
				}),
				lmsTarget
			);
			parent.postMessage(
				JSON.stringify({
					scormFunction: 'lesson_DoFSCommand',
					scormCommand: 'LMSSetValue',
					scormValue: 'cmi.core.score.max,' + totalQuestions
				}),
				lmsTarget
			);

			parent.postMessage(
				JSON.stringify({
					scormFunction: 'lesson_DoFSCommand',
					scormCommand: 'LMSSetValue',
					scormValue: 'cmi.core.score.raw,' + studentScore
				}),
				lmsTarget
			);
			parent.postMessage(
				JSON.stringify({
					scormFunction: 'lesson_DoFSCommand',
					scormCommand: 'LMSCommit',
					scormValue: ''
				}),
				lmsTarget
			);
			parent.postMessage(
				JSON.stringify({
					scormFunction: 'lesson_DoFSCommand',
					scormCommand: 'LMSSetValue',
					scormValue: coreLessonCompletion
				}),
				lmsTarget
			);

			parent.postMessage(
				JSON.stringify({
					scormFunction: 'lesson_DoFSCommand',
					scormCommand: 'LMSSetValue',
					scormValue: coreLessonStatus
				}),
				lmsTarget
			);
		} catch (e) {
			return console.log('**Scoring Error: ' + err);
		}

		(function() {
			scoreSummary['testStatus'] = testStatus;
			scoreSummary['totalQuestions'] = totalQuestions;
			scoreSummary['totalCorrect'] = totalCorrect;
			scoreSummary['studentScoreScaled'] = studentScoreScaled;
			scoreSummary['studentScore'] = studentScore;
			console.log(scoreSummary);
		})();
	}
};

// Putting it together
function getAllScorm(lmsTarget) {
	var debug = 'y';

	parentCommGet('', lmsTarget);
	parentCommGet('cmi.suspend_data', lmsTarget);

	var callback = function(value) {
		console.log('Value Received: ' + value);
	};

	if (typeof callback != 'undefined') {
		// Create IE + others compatible event handler
		var eventMethod = window.addEventListener
			? 'addEventListener'
			: 'attachEvent';
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
		var lessonLocation = '';
		// var queryString = '';
		var userName = '';

		eventer(messageEvent, function(e) {
			// console.log('Parent received message and returned data: ', e.data);

			// read the message and parse to the correct variables
			msg = JSON.parse(e.data);

			switch (msg.variableName) {
				case 'studentid':
					var studentidPromise = new Promise(function(resolve, reject) {
						studentid = msg.variableValue;
						console.log('studentid was set!!!!');
					}).then(
						() => {
							console.log(resolve);
							console.log('studentid was set: ' + studentid);
							callback(studentid);
						},
						() => {
							studentid = 'Not Set Yet Part 2';
							console.log(reject);
						}
					);
					// console.log(studentidPromise);
					break;
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
					if (debug == 'y') console.log('queryString was set!!!!');
					callback(queryString);
					break;
				case 'userName':
					userName = msg.variableValue;
					if (debug == 'y')
						console.log('SCORM.JS LINE 75: userName is ' + userName);
					callback(userName);
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
	}
}
//Magic Ends

// Main Calls //
// Get All!
scormFun.get = function(lmsTarget) {
	getAllScorm(lmsTarget);
};

// Update or set a value AKA Suspend Data
scormFun.set = function(scormValue, scormTask, lmsTarget) {
	parentCommSend(scormValue, scormTask, lmsTarget);
};

// Suspend the data and update lms ----- We will just use set
// scormFun.suspend = function(lmsTarget, string) {};

// scoring
scormFun.score = function(
	passingGrade,
	totalQuestions,
	totalCorrect,
	lmsTarget
) {
	parentCommScore(passingGrade, totalQuestions, totalCorrect, lmsTarget);
};

// module.exports = scormFun;
