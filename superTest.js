class Patterns {
	constructor() {
		this.patterns = {
			// Test's patterns: buttons, images etc
			load: (curStepDesc, container) => {
				let content = curStepDesc['content']; 
				return {
					'button': {
						create: () => {
							for (let i in content){
								let elementAnswer = {
									'tag': 'button',
									'className': 'answer-btn s-hidden',
									'id': ' ',
									'innerHTML': i
								}
								let btn = this.addElement(elementAnswer, container);
								btn.onclick = () => {
									this.nextStep(i);
								};
							}
						}
					},
					'img': {
						create: () => {
							for (let i in content) {
								let elementAnswer = {
									'tag': 'img',
									'className': 'answer-image s-hidden',
									'src': i
								}
								let img = this.addElement(elementAnswer, container);
								img.onclick = () => {
									img.onclick = null;
									this.nextStep(i);
								};
							}
						}
					},
					'checkbox': {
						create: () => {
							for (let i in content){

								let elementDiv = {
									'tag': 'div',
									'className': 's-hidden'
								}
								let div = this.addElement(elementDiv,container);


								let elementCheckbox = {
									'tag': 'input',
									'type': 'checkbox',
									'id': Math.random() + '_superTest',
									'className': 'answer-checkbox'
								}

								let checkbox = this.addElement(elementCheckbox, div);

								let val = curStepDesc['content'][i]; // This is how many points the checkbox gives
								checkbox.onchange = () => {
									if (checkbox.checked) {
										this.tempScore += val;
										this.selected++;
									} else {
										this.tempScore -= val;
										this.selected--;
									}
									this.selected > 0 ? btn.removeAttribute('disabled') : btn.disabled = 'True';
								}

								let elementLabel = {
									'tag': 'label',
									'className': 'answer-label',
									'htmlFor': checkbox.id,
									'innerHTML': i
								}

								let label = this.addElement(elementLabel,div);
								label.onclick = () => {
									if (!checkbox.checked) {
										this.tempScore += val;
										this.selected++;
									} else {
										this.tempScore -= val;
										this.selected--;
									}
								}

							}

							let elementBtn = {
								'tag': 'button',
								'className': 'answer-btn s-hidden',
								'innerHTML': this.styles['btnNextInnerHtml'],
								'disabled': 'True'
							}

							let btn = this.addElement(elementBtn, container);
							btn.onclick = () => {
								this.nextStep(this.tempScore, 'multiple');
							};

							let checkboxes = document.getElementsByClassName('answer-checkbox');
						}
					},
				}
			}
		}
	}

	// Add an element to DOM
	addElement (element, block) {
		let DOM = document.createElement(element['tag']);
		for(let attr in element){
			if (attr != 'tag') {
				DOM[attr] = element[attr];

				if (attr == 'style') {
					for (let css in attr){
						DOM.style.css = attr[css];
					}
				}
			}
		}

		return block.appendChild(DOM,block.firstChild);
	}
}

class Board extends Patterns {
	constructor() {
		super();
		this.block; // This is the block in which we append the test board
		this.removeBoardOnEnd = false; 
		this.fadeOutTime = 1000;
		this.fadeInTime = 1000;
		this.container = {
			element: undefined, // The board DOM element
			clear: (time) => {
				let children = this.container.element.children;
				for (let i = 0; i < children.length; i++) {
					this.fadeOut(children[i]);
				}

				setTimeout( () => {
					while (this.container.element.firstChild) {
						this.container.element.firstChild.remove();
					}		
				}, time);
			},
			show: (time) => {
				let children = this.container.element.children;
				for (let i = 0; i < children.length; i++){
					children[i].style.opacity = '0';
					this.fadeIn(children[i]);
				}

			}
		}
	}

	fadeIn (element)  {
		let counter = 0.01; 
		let interval = setInterval(function () {
	        if (element.style.opacity < 1) {
	            element.style.opacity = Number(element.style.opacity) + counter;
	        } else {
	        	if(element.style.opacity > 1) {
	        		element.style.opacity = 1;
	        	}
	            clearInterval(interval);
	        }
	    },this.fadeInTime * counter);

	}

	fadeOut (element)  {
		let counter = 0.01;
	    element.disabled = 'True'; 
		let interval = setInterval(function () {
	        if (element.style.opacity > 0) {
	            element.style.opacity = Number(element.style.opacity) - counter;
	        } else {
	        	if(element.style.opacity < 0) {
	        		element.style.opacity = 0;
	        	}
	            clearInterval(interval);
	        }
	    },this.fadeOutTime * counter);

	}

	initBoard(block, removeOnEnd){
		this.block = block;
		let container = {
			'tag': 'div',
			'className': 's-hidden question-container',
		}
		container = this.addElement(container,block);
		this.fadeIn(container);
		this.container.element = container; // Assigning the board element
		this.removeBoardOnEnd = removeOnEnd; 
	}
}


class superTest extends Board {
	constructor(stepDesc,type,callback,styles) {
		super();
		this.callback = callback; // Function called when the test is over
		this.steps = stepDesc.length;
		this.type = type; // Type of test : score or binary
		this.stepDesc = stepDesc; // The test description array
		this.curStep = 0;
		this.score = 0; // Test score
		this.tempScore = 0; // TEmporary score used for checkboxes
		this.selected = 0; // This is how many checkboxes are selected right now
		this.right = 0; // Number of correct answers
		this.wrong = 0; // Number of wrong answers
		this.history =  []; // History of answer for binary tests
		// Test styles
		this.styles = {
			'btnNextInnerHtml': 'Next'
		}
		for (let style in styles) {
			this.styles[style] = styles[style];
		}
	}

	start () {
		this.nextStep();
	}

	end () {

		let response = {
				'type': this.type,
				'steps': this.steps,
			}

		if (this.type == 'score') {
			response['score'] = this.score;
		} else if(this.type == 'binary') {
			response['right'] = this.right;
			response['wrong'] = this.wrong;
			response['history'] = this.history;
		}

		if (this.removeBoardOnEnd) {
			this.container.clear(1000);
			setTimeout( () => {
				this.container.element.remove();
				if (typeof this.callback == 'function') {
					this.callback(response);
				}
			},1001);
		} else {
			if (typeof this.callback == 'function') {
				this.callback(response)
			}
		}

		
	}


	// There are two types: single and multiple
	// Value is the index value of current step
	nextStep (value, type ='single') {
		let time = 0;
		// If this is not the first step when the test is just initialized and no answers were given, change the score
		if (this.curStep != 0) {
			// Removing on click functions
			let children = this.container.element.children;
			for (let child in children) {
				if (typeof children[child] == 'object') {
					children[child].onlick = null;
				}
			}
			let val = this.stepDesc[this.curStep - 1]['content'][value]; // Here we basically get the score
			if (this.type == 'score') {
				let score;
				if (type == 'single') {
					score = Number(val) + Number(this.score);
				} else if(type == 'multiple'){
					// When type equals 'multiple', we provide the temporary score instead of index value
					this.tempScore = 0;
					this.selected = 0;
					score = Number(this.score) + value;
				}
				this.score = score;
			} else if(this.type == 'binary'){
				let score = val;
				score === true ? this.right++ : this.wrong++;
				this.history.push(score);
			}

			this.curStep < this.steps ? time = 0 : time = this.fadeOutTime;
			this.container.clear(time);
		}

		setTimeout( ()  => {
			if (this.curStep < this.steps) {

				let elementQuestion = {
					'tag': 'p',
					'className': 'question',
					'innerHTML': this.stepDesc[this.curStep]['question']
				}

				this.addElement(elementQuestion, this.container.element);		

				let innerType = this.stepDesc[this.curStep]['tag']; // Get the pattern name

				this.patterns.load(this.stepDesc[this.curStep],this.container.element)[innerType].create();
				this.curStep++;
				this.container.show(0);
			} else {
				this.end();
			}
		},1);
	}
			
}
