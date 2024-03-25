// const http = require("http");
// const app = require("./app");
// const server = http.createServer(app);
// const PORT = 3000;
// server.listen(PORT, () => console.log(`server listening on port ${PORT}`));

const repl = require('node:repl');
const fs = require('node:fs');
const { exec } = require('node:child_process');
const { Readable, Writable, PassThrough } =  require('node:stream');

const codeInput = `
	global;
`;
let codeOutput = '';

const prompt = 'custom-repl-server>';

const inputTunnel = new PassThrough();
inputTunnel.write(codeInput);

const outputTunnel = new PassThrough();

const replServer = repl.start({
	prompt,
	input: inputTunnel,
	output: outputTunnel
});

outputTunnel.on('data', chunk => {
	replServer.resume();
	if (chunk.toString() == prompt) return;
	codeOutput = chunk;
})

replServer.on('SIGTSTP', () => {
	console.log('repl server paused');
});

replServer.on('exit', () => {
	console.log('Exiting REPL Session');
	console.log('code output:', codeOutput);
	inputTunnel.write(codeInput);
});

replServer.on('error', err => console.error(err))

