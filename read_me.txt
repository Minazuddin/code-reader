CODE READER

Introduction:

The main theme of this project  is to make the devs visualize their data while writing code to build logics.

Working:

=> User will write their code in UI text editor and then submit.
=> The code is sent to the server for execution
=> The processed code and its output is sent back to the user and is well presented
in a more readable form.

for example, consider the following code for finding the difference between two dates

{<>}
const findDifferenceBetweenDates = (date1) => {
	date1 = new Date(date1);
	const currentDate = new Date();
	
	// logic for finding diffference in time and date 
}
{<>}

once the above code is sent for execution, the output from the server would be like,

[In a More Visual Format]

[variable] [value]

[date1] 		[object] 	[props of object]
[currentDate] 	[object] 	[props of object]
[resultDate]	[object]	[props of object]


Algorithm:

1. Compile the code using nodejs

2. In the backend, once the chunk of code is received, 
=> write a file and load it with the user code
=> execute the file and send the output 