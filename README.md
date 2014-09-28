# Flaming Sansa

Angular Graphing Library.

## Hacking

```
git clone
npm install
node app.js
```

The node app will print a banner. Visit that. Click around. Demos are listed
along the bottom tab bar.

### Demos

In `src/client/demos`. Add a folder. Add `directive` to the folder. The
directive should declare a module, `graphing.demo.#{DEMONAME}`. In the demo
module, add a config block depending on `$stateProvider`. Define a new state
that is a child of `demo`.  
