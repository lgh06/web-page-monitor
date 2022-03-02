/**
 * Change Log
 * Add Core Method ESMLoader
 */


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
// https://datatracker.ietf.org/doc/html/rfc3986#section-2.2
// https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding
export const moduleString = str => `data:text/javascript,${encodeURIComponent(str)}`;
// https://github.com/webpack/webpack/issues/12731
export const ESMLoader = str => import(/* webpackIgnore: true */moduleString(str));

export const escapeHtml = s => (s + '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
})[m]);
export const nodeFetchOld = url =>
    import(/* webpackIgnore: true */'http')
        .then(({ default: http }) =>
            new Promise((resolve, rej) => {
                http.get(url, res => {
                    const { statusCode, headers } = res;
                    if (statusCode === 200) {
                        let rawData = '';
                        //res.setEncoding('utf8');
                        res.on('data', d => rawData += d);
                        res.on('end', () => resolve(rawData));
                        res.on('error', rej)
                    } else {
                        rej({ url, statusCode, headers })
                    }
                });
            })
        );

export const nodeFetch = url =>{
  return import(/* webpackIgnore: true */'make-fetch-happen').then( ({ default: cacheFetch }) => {
    cacheFetch = cacheFetch.defaults({
      cachePath: './cache'
    });
    return cacheFetch(url).then(res => res.text());
  });
}

export const fetch = typeof window !== 'undefined' ? window.fetch : nodeFetch;
export const fetchImport = url => fetch(url).then(ESMLoader);
// You should not use it as it has sideeffects that are complex use ESMLoader for consistent behavior.
// With nodeJS Relativ resolution would not work with the browser it would
// ./ === url split / last item if that gets added it would behave consistent as long as all dependencys 
// are using ESMImport thats why its not documented or added to external api till import.meta is solved.
export const ESMImport = url => typeof window === 'undefined' ? fetchImport(url) : import(/* webpackIgnore: true */url);
export { ESMImport as importScript }

// Exports a Module that exports a str object
// Usage importStrToExport('https://mytemplate.com/index.html').then(({ str })=>console.log(str))
// Example that shows how to assign a result to a var for advanced scenarios. like in tag-html or
// tagged-template-strings packages.
// Most Advanced usecase is shim const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
export const importStrToExport = url => fetch(url).then(str => ESMLoader(`export const str = \`${str}\``))
// Most Advanced usecase is shim const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
//export const inlineRequire = parseRequire statments into obj then return Obj with results of results
//Global symbol registry
//ES6 has a global resource for creating symbols: the symbol registry. The symbol registry provides us with a one-to-one relationship between strings and symbols. The registry returns symbols using Symbol.for( key ).
//Symbol.for( key1 ) === Symbol.for( key2 ) whenever key1 === key2. This correspondance works even across service workers and iframes.
