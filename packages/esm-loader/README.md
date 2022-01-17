# esm-loader
Allows to load esm from any file formart can be seen as loader construction kit while offering precoded methods to do generic loader stuff in cross environment applications. It also can be seen as Pollyfill for importScript and dynamic import from url for NodeJS.

## CHANGELOG ##
breaking change is deprecating strToESM its successor is ESMLoader and moduleString


## Usage
Host a local or remote server with scripts or use https://unpkg directly inside nodeJS via "esm-loader"
The Steps to form a Module Instance with livebindings!
- Getting the Module Code
- Optional Transform it
- Construction Instantiation Evaluation via ESMLoader

## Examples
String to ESModule Examples Cross Environment
```js
import { ESMLoader } from 'esm-loader/loader.mjs'

const module = ESMLoader('export const myModule = { yellow: \'snowflakes\'}')
    .then(({ myModule })=>console.log(myModule.yellow)) // Logs: snowflakes
``` 

```js
import { moduleString } from 'esm-loader/loader.mjs'

const module = import(moduleString('export const myModule = { yellow: \'snowflakes\'}'))
    .then(({ myModule })=>console.log(myModule.yellow)) // Logs: snowflakes
``` 



Inside NodeJS with modules support
==========
ESMLoader used inside NodeJS supports NodeJS Module Resolve but not relative resolve
you can support it via a transformation step after loading your code you can simply 
replace any ./ ../ urls with correct resolved values relative to your current
loaded module or the module loading path of the scipt you plan to instantiate and 
evaluate to ESM via ESMLoader.

ESMLoader ships with a example method to get code from a remote file via a isomorpic fetch
This allows to use import with dynamic content.

```js
// The exported fetch is cross environment Nodejs and Browser
import { ESMLoader, fetch ,fetchImport, dynamicImport } from 'esm-loader/loader.mjs'

// Creates a dynamic import from a string
// Returns a ESM Module with exports from string has resovle for Bare and Absolut Specifiers
// can easy be rewritten for your own extensions
fetchImport('url') //is a shortHand helper for fetch('https://url.to/your/js.mjs').then(ESMLoader)
    .then(mod=>console.log(mod))

dynamicImport('url') // uses import in the browser and fetchImport in nodejs
```
CJS
```js
const fs = require('fs')
//ESM-LOADER is ES so you need to use dynamic import
import('esm-loader/esm-loader.mjs') // NodeJS Resolve used here
  .then(({ ESMLoader })=>fs.promises.readFile('path/to/file.txt,ts,any').then(ESMLoader)) // NodeJS Resolve used here 
  //no relativ urls can use transformations befor then(ESMLoader)
  .then(myModule=>console.log(myModule)) //=> returns a real ESModule
```



inside browser for custom elements or scripts 
========

```js
import { ESMLoader, dynamicImport } from 'esm-loader/loader.mjs'

// Creates a dynamic import from a string

// can easy be rewritten for your own extensions
fetch('https://url.to/your/js.mjs')
    .then(ESMLoader)
    /**
     *  Returns a ESM Module with exports from string 
     *  has resolve for Bare and Absolut Specifiers
     *  Your Can Easy rewrite the String that you get from 
     *  fetch befor you use it as input to ESMLoader.
     */
    .then(mod=>console.log(mod))

dynamicImport('url') // uses import in the browser and fetchImport in nodejs
```

# rollup support landed
https://github.com/rollup/plugins/pull/150

# Advanced Stuff
Lets Import a mjs file from a source and rewrite it to resolve to the right locations
if relativ specifiers are used 
```js
// TODO:
``` 

- https://github.com/guybedford/es-module-lexer used with webworkers is powerfull.
  - can be used to build webworker integrations eg moduleString transformed for webworkers
  - setup a proxy object based on the lexer result in main and run it with ESMLoader while hand of a transformed webworker version to new Worker()