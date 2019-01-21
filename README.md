# superTest
This is a JavaScript library for creating tests.

# Instruction

<h3>First of all you have to initialize your test.</h3>

<i> <b> let test = new superTest(testArray,type,callbackFunction,styles); </b> </i>

<i>testArray</i> - pass an array including assosciative arrays each representing a question.

<i> type </i> - test type: "binary" or "score"

<i> callbackFunction </i> - function that will be called when the test is over

<i> styles </i> - an associative array with board parameters. The only one available so far is <i>"btnNextInnerHtml"</i> is for localization of the "next" button for checkboxes


<h3> Then you have to initialize the board </h3>

<i> <b> test.initBoard(block,removeOnEnd) </b> </i>

<i> block </i> - the element inside which the test will be initialized

<i> removeOnEnd </i> - wheter the board will be removed when the test ends or not

<h3> Then just start the test </h3>

<i> <b> test.start() </b> </i>

# testArray format
<b> Associative array format: { "tag": value, "question": value, "content" : { value1,value2 } } </b>

<i> tag </i> - basically question type: button, img or checkbox <i> //checkboxes are availabel only for score tests </i>

<i> question </i> - question displayed on the step

<i> content </i> - questions and their values. Example: { "dog": true, "cat": false } <i>// <b>true</b> or <b>false</b> for "binary" and any <b>number</b> for "score" type </i>

# callbackFunction argument

You will get an associative array as the function argument returning you

<ul> 
<li> Test type </li>
<li> Number of steps </li>
</ul>

And depending on your test type you will also get 

<b> Score tests </b>
<ul>
<li> Score </li>
</ul>

<b> Binary tests </b>
<ul> 
<li> Number of right answer </li>
<li> Number of wrong question </li>
<li> Answer history (<i>array</i>) </li>
</ul>

