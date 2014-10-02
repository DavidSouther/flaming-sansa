# Flaming Sansa

Angular SVG & Graphing Library.

Flaming Sansa provides a number of Angular-friendly SVG primitives:

* Utilities to scale from a model space to the page space.
* Angular digest and expression aware svg attributes for lines, circles, etc.
* Smart path filters, to quickly create an expression describing a data path.
* Base charting directives, providing a consistent data and options model.
* Common chart features, including legends, axes, animations and interactions.
* Composable charts, including line graphs, bar graphs, and scatter plots.

## Demos

These charts and visualizations are examples, both for inspiration and a living
document of best practices. https://davidsouther.com/flaming-sansa

## Hacking

Flaming-sansa is entirely self-contained as a node.js application. Simply
clone, install, and run.

```
git clone
npm install
npm start
```

The node app will print a banner. Visit that. Click around. Demos are listed
along the bottom tab bar.

So long as the node application is running, any changes to the code will be
compiled on save. Syntax and compilation expressions will print to the console.

### Adding a Demo

See current demos for sample code.

**Checklist:**

* [ ] Add a new module, `graphing.demos.name`.
* [ ] Add that module as a dependency to `graphing.demos`.
* [ ] Create a directive, template, and style sheets.
* [ ] Attach the directive as a child state of `demo`.
* [ ] Add a tab in `demos/template.jade`.

### Running Tests

`npm test` will run all unit and feature tests, defaulting to using Google
Chrome. To run the feature tests, [`ChromeDriver`][chromedriver] will need to be
on your system's path.

### Source Code Layout

```
.
├── Gruntfile.coffee    # Task configuration.
├── README.md           # Project documentation and overview.
├── app.js              # Node Server Bootstrap.
├── package.json        # NPM Package Settings.
├── server.json         # ng-stassets configuration.
└── src                     # All source files. Only edit files in here.
    ├── client              # Browser-side files
    │   ├── Gruntfile.coffee    # Browser test configuration
    │   ├── all.styl            # Top-level styles, to control the page.
    │   ├── animation           # Animation helpers
    │   │   └── style
    │   │       └── service.coffee # Service to mange dynamic css animations.
    │   ├── charts      # Chart code
    │   │   ├── axis
    │   │   │   ├── all.styl
    │   │   │   ├── directive.coffee
    │   │   │   └── template.jade
    │   │   └── bar
    │   │       ├── all.styl
    │   │       ├── directive.coffee
    │   │       └── template.jade
    │   ├── d3          # Code copied from D3 (mostly their math libraries).
    │   │   ├── LICENSE
    │   │   ├── main.js
    │   │   ├── math
    │   │   │   └── sign.js
    │   │   └── svg
    │   │       ├── lineCardinalTangents.js
    │   │       ├── lineFiniteDifferences.js
    │   │       ├── lineHermite.js
    │   │       ├── lineMonotoneTangents.js
    │   │       └── lineSlope.js
    │   ├── demos   # Any demos showing ng svg functionality
    │   │   ├── bar
    │   │   │   ├── all.styl
    │   │   │   ├── directive.coffee
    │   │   │   └── template.jade
    │   │   ├── main.coffee
    │   │   ├── template.jade
    │   │   └── trig    # A visualization showing the behavior of sine.
    │   │       ├── all.styl
    │   │       ├── directive.coffee
    │   │       └── template.jade
    │   ├── index.jade
    │   ├── scales
    │   │   └── main.js
    │   ├── svg     # SVG Utility Directives
    │   │   ├── at
    │   │   │   ├── directive.js
    │   │   │   └── directive.test.coffee
    │   │   ├── center
    │   │   │   ├── directive.js
    │   │   │   └── directive.test.coffee
    │   │   ├── drawPath
    │   │   │   ├── all.styl
    │   │   │   └── directive.js
    │   │   ├── from
    │   │   │   ├── directive.js
    │   │   │   └── directive.test.coffee
    │   │   ├── graphTick
    │   │   │   ├── directive.js
    │   │   │   └── directive.test.coffee
    │   │   ├── main.js
    │   │   ├── path
    │   │   │   └── directive.js
    │   │   ├── radius
    │   │   │   ├── directive.js
    │   │   │   └── directive.test.coffee
    │   │   ├── scatterPoint
    │   │   │   └── directive.js
    │   │   ├── svg
    │   │   │   ├── directive.js
    │   │   │   └── directive.test.coffee
    │   │   └── to
    │   │       ├── directive.js
    │   │       └── directive.test.coffee
    │   └── tools 
    │       ├── energize
    │       │   └── directive.coffee
    │       ├── groupBy
    │       │   └── filter.coffee
    │       ├── httpBackend.coffee
    │       ├── localStorage
    │       │   └── service.coffee
    │       ├── render.coffee
    │       └── socketBackend.coffee
    └── deploy
        └── Gruntfile.coffee
```

[chromedriver]: https://code.google.com/p/selenium/wiki/ChromeDriver
