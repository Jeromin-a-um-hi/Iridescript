#!/usr/bin/env node

// Entry point into Iridescript REPL or transpiler.

const prompter = require("prompt-sync")({ sigint: true });
const fs = require("fs");
import { runner } from "./runner";

const args: string[] = process.argv;
const commands: string[] = ["c",  "compile",
			    "cf", "compile-file",
			    "h",  "help"];

const help = function (): void {
  console.log(`
    Official Iridescript transpiler. Run without any commands to open the REPL.

    Usage:

    iridescript <command>

    Commands:

    cf compile-file <link to file>  Used to transpile a singular file  
    h  help                         Will print information regarding the usage of this program
  `);
}

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
      fs.readFile(args[3], 'utf8', (err: Error, data: string) => {
	if (err) {
	  return console.log(err);
	} else {
	  fs.writeFile(`${args[3]}.js`, runner(data), (err1: Error) => {
		if (err1) {
		    console.error(err1);
		}
	    });
	}
      })
    } else {
      console.log("Error: File Unspecified\n");
      help();
    }
  }
} else{
  console.log("Welcome to the Iridescript REPL! Type exit to exit! \n\n")
  function readLine() {
    const line = prompter(">>> ");
    if (line !== "exit") {
      runner(line);
      readLine();
    } else {
      console.log("\n");
    }
  }
  readLine();
}

