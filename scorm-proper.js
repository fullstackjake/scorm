//Magic Start
function getAllScorm(varible) {
	var debug = 'y';
	var scormFunction = 'g_objAPI',
		scormCommand = 'LMSGetValue',
		scormValue = 'cmi.core.student_id';

	callback = function(studentid) {
		console.log('studentid Received');
	};

	var lmsTarget = '*';

	if (lmsTarget == false || typeof lmsTarget == 'undefined') {
		lmsTarget = '*';
	}

	// make sure all the arguments have been passed in
	try {
		if (typeof scormFunction == 'undefined') throw 'scormFunction is empty';
		if (typeof scormCommand == 'undefined') throw 'scormCommand is empty';
		if (typeof scormValue == 'undefined') throw 'scormValue is empty';
		if (typeof lmsTarget == 'undefined') throw 'lmsTarget is empty';
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
			lmsTarget
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
		// var lessonLocation = '';
		// var queryString = '';
		// var userName = '';

		eventer(messageEvent, function(e) {
			console.log('Parent received message and returned data: ', e.data);

			// read the message and parse to the correct variables
			msg = JSON.parse(e.data);

			switch (msg.variableName) {
				case 'studentid':
					studentid = msg.variableValue;
					if (debug == 'y') console.log('studentid was set: ' + studentid);
					callback(studentid);
					break;
				default:
					break;
			}
		});
	} // end typeof callback != 'undefined'
}
//Magic Ends

// Main Calls //
// Get All!
get = function() {
	var studentid = 'Not Set Yet';

	// getAllScorm(studentid);

	var studentidPromise = new Promise(function(resolve, reject) {
		getAllScorm(studentid);
	}).then(
		() => {
			studentid = studentid;
		},
		() => {
			studentid = 'Not Set Yet PArt 2';
		}
	);
	// object.studentid = studentid;
	console.log('Promise is: ' + studentid);
	return studentid;
};

// Update or set a value
set = function(lmsTarget, scormValue) {};

// scoring
score = function(min, max, score, status) {};

// Suspend the data and update lms
suspend = function(min, max, score, status) {};

// const scormFun = module.exports;
