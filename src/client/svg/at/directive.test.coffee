describe 'Graphing SVG', ->
    describe '`at` directive', ->
        beforeEach module 'graphing.svg.at'

        it 'Attaches an `x` and `y` attribute to a `<text>` element.', ->
            tag = 'text'
            data = { $x: 5, $y: 1.2}
            attrs = { at: "[$x, $y]"}
            transclude = "Some Text"
            element = renderElement tag, data, attrs, transclude
            element.attr('x').should.equal '5'
            element.attr('y').should.equal '1.2'
