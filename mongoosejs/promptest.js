const prompt = require("prompt");

async function fn() {
	// prompt.start();
	try {
		const {username, email} = await prompt.get(["username", "email"]);
		console.log("Result:", {username, email});
		process.exit(); //To exit the program.
	} catch (e) {
		console.log("oops err", e);
	}
}

fn();

// Src:
// https://github.com/flatiron/prompt
// https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
