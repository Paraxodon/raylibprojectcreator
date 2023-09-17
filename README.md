# raylibprojectcreator README

Raylib Project Creator is a very simple extension that adds a command to create a project for raylib in a given directory.

## Features

Raylib Project Creator adds a simple command to the command palette that copies for you a new raylib project from the raylib examples so
you don't have to do it manually every time.

## Known Issues

Only works for default raylib path, if you have moved raylib from the default instalation path you won't be able to use this extension.


## How to build

On VsCode Terminal do the following command ```npm install -g @vscode/vsce``` and then just do ```vsce package```. This will create a .vsix that you can install
through the 3 dots in the extensions menu.