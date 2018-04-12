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

	checkMethod() {
		if (this.args.req === 'get') {
			console.log('It was GET!!!!');
		} else if (this.args.req === 'send') {
			console.log('It was SEND!!!!');
		} else {
			console.log('It was SCORE!!!!');
		}
	}

	toString() {
		return `I need to ${this.args.req}, Using these values: ${
			this.args.lmsTarget
		}`;
	}

	print() {
		console.log(this.toString());
	}
}

const scormFun = new Scorm(get);

scormFun.print();
