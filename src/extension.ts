// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {  mkdir, readdir } from 'fs';
import path = require('path');
import * as vscode from 'vscode';

let raylibPath: string | undefined = undefined;

async function getFolderPath() {
	const result = await vscode.window.showOpenDialog({
	  canSelectFiles: false,
	  canSelectFolders: true,
	  canSelectMany: false,
	  openLabel: 'Select Path',
	});
  
	if (result && result.length > 0) {
	  const selectedPath = result[0].fsPath;
	  console.log('Selected path:', selectedPath);
	  return selectedPath;
	} else {
	  console.log('No path selected.');
	  return undefined;
	}
  }

  function copyDirectory(source: string, destination: string) {
	mkdir(destination, (err) => {
	  if (err) {
		vscode.window.showErrorMessage('Error creating destination folder: ' + err);
		return;
	  }
  
	  vscode.workspace.fs.readDirectory(vscode.Uri.file(source)).then((files) => {
		files.forEach(([file, fileType]) => {
		  const sourcePath = path.join(source, file);
		  const destinationPath = path.join(destination, file);
  
		  if (fileType === vscode.FileType.Directory) {
			// Recursively copy the subdirectory
			copyDirectory(sourcePath, destinationPath);
		  } else {
			// Copy the file
			vscode.workspace.fs.copy(vscode.Uri.file(sourcePath), vscode.Uri.file(destinationPath));
		  }
		});
	  });
	});
  }

export function activate(context: vscode.ExtensionContext) {


	// Declare and initialize raylibPath with a default value
	let raylibPath: string = context.workspaceState.get<string>('raylibPath', path.join('c:', 'raylib'));

	let createProject = vscode.commands.registerCommand('raylibprojectcreator.createProject', async () => {
		
		//Maybe you could add a path?
		const folderName = await vscode.window.showInputBox({
			prompt: "Enter project name:",
			placeHolder: "MyProject",
		});

		if(!folderName){
			vscode.window.showErrorMessage('Project name not provided.');
		 	return;
		}

		let projectFolderPath = await getFolderPath();
		if(projectFolderPath){
			projectFolderPath = path.join(projectFolderPath, folderName);
			vscode.window.showErrorMessage("Current raylib path is: " + path.join('c:', 'raylib') + ". This message is for debugging purposes");
			copyDirectory(path.join(raylibPath, "raylib", "projects", "VSCode"), projectFolderPath);
		}
		else{
			vscode.window.showErrorMessage('Error on path.');
		}

	});

	let setRaylibPath = vscode.commands.registerCommand('raylibprojectcreator.setRaylibPath', async () =>{
		const newPath = await getFolderPath();

		if (newPath) {
			raylibPath = newPath;
			context.workspaceState.update('raylibPath', raylibPath);
		} 
		else {
			
    	}
	});

	context.subscriptions.push(createProject);
	context.subscriptions.push(setRaylibPath);
}

// This method is called when your extension is deactivated
export function deactivate() {}
