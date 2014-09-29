describe 'Graphing SVG', ->
    describe '`from` directive', ->
        beforeEach module 'graphing.svg.from'

        it 'Attaches an `x1` and `y1` attribute to a `<line>` element.', ->
            tag = 'line'
            data = { $x: 3, $y: 5.2}
            attrs = { from: "[$x, $y]"}
            element = renderElement tag, data, attrs
            element.attr('x1').should.equal '3'
            element.attr('y1').should.equal '5.2'
