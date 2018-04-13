/*

Library of things

  REQUESTS
    get,
    set,
    score

	REQUIRED VALUES SCORING
		passingGrade,
		totalQuestions,
		totalCorrect,
		lmsTarget
*/

'use strict';

// Gets student id as studentid and suspendata as queryString.. Also any mastery score?
const get = {
	req: 'get',
	scormTask: null,
	lmsTarget: '*'
};

// Sends url as suspendata for bookmarking.
const send = {
	req: 'send',
	suspend:
		'https://lessons.lmscourses.com/index.php/en-us/lms-courses-accidents-and-breakdowns/P8?visited=P1P2P3P4P5P6P7',
	lmsTarget: '*'
};

const score = {
	req: 'score',
	passingGrade: 100,
	totalQuestions: 10,
	totalCorrect: 10,
	lmsTarget: '*'
};

// Scorm is a base class
class Scorm {
	constructor(args) {
		this.args = args;
	}

	get() {
		if (this.args.req === 'get') {
			// Getting Values from parent IFRAME
			const parentCommGet = getScorm => {
				const scormTask = getScorm.scormTask,
					lmsTarget = getScorm.lmsTarget;
				if (scormTask == null || scormTask == false) {
					scormTask = 'cmi.core.student_id';
				}
				if (
					lmsTarget == typeof 'undefined' ||
					lmsTarget == null ||
					lmsTarget == ''
				) {
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
			parentCommGet(this.args);
		}
	}

	send() {
		return `I need to ${this.args.req}, Using these values: ${
			this.args.lmsTarget
		}`;
	}

	score() {
		console.log(this.toString());
	}
}

const scormFun = new Scorm(get);

scormFun.print();
