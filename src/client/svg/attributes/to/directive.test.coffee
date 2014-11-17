describe 'Graphing SVG', ->
    describe '`to` directive', ->
        beforeEach module 'graphing.svg.to'

        it 'Attaches an `x2` and `y2` attribute to a `<line>` element.', ->
            tag = 'line'
            data = { $x: 5, $y: 1.2}
            attrs = { to: "[$x, $y]"}
            transclude = "Some Text"
            element = renderElement tag, data, attrs
            element.attr('x2').should.equal '5'
            element.attr('y2').should.equal '1.2'
