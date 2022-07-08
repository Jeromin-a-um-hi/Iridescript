#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompter = require("prompt-sync")({ sigint: true });
const fs = require("fs");
const runner_1 = require("./runner");
const args = process.argv;
const commands = ["c", "compile",
    "cf", "compile-file",
    "h", "help"];
const help = function () {
    console.log(`
    Official Iridescript transpiler. Run without any commands to open the REPL.

    Usage:

    iridescript <command>

    Commands:

    c  compile                      Used to transpile an entire project based on the contents of irideconfig.json
    cf compile-file <link to file>  Used to transpile a singular file  
    h  help                         Will print information regarding the usage of this program
  `);
};
if (args[2]) {
    if (args.length > 4) {
        help();
    }
    if (args[2] === "h" || args[2] === "help") {
        help();
    }
    if (commands.indexOf(args[2]) == -1) {
        console.log("Error: Invalid Command \n");
        help();
    }
    if (args[2] === "cf" || args[2] === "compile-file") {
        if (args[3]) {
            fs.readFile(args[3], 'utf8', (err, data) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    fs.writeFile(`${args[3]}.js`, (0, runner_1.runner)(data), (err1) => {
                        if (err1) {
                            console.error(err1);
                        }
                    });
                }
            });
        }
        else {
            console.log("Error: File Unspecified\n");
            help();
        }
    }
}
else if (args[2] === "c" || args[2] === "compile") {
}
else {
    console.log("Welcome to the Iridescript REPL! Type exit to exit! \n\n");
    function readLine() {
        const line = prompter(">>> ");
        if (line !== "exit") {
            (0, runner_1.runner)(line);
            readLine();
        }
        else {
            console.log("\n");
        }
    }
    readLine();
}
