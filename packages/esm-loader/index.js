module.exports = function (url) {
    return import('./esm-loader.mjs') // NodeJS Resolve used here if Node
        .then(({ ESMLoader, fetch })=>fetch('httpscript url').then(ESMLoader)) // NodeJS Resolve used here no relativ urls
        .then(myModule=>console.log(myModule)) //=> returns a real ESModule
}