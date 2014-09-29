describe 'Graphing SVG', ->
    describe '`center` directive', ->
        beforeEach module 'graphing.svg.center'

        it 'Attaches a `cx` and `cy` attribute to a `<circle>` element.', ->
            tag = 'circle'
            data = { $x: 5, $y: 1.2}
            attrs = { center: "[$x, $y]"}
            element = renderElement tag, data, attrs
            element.attr('cx').should.equal '5'
            element.attr('cy').should.equal '1.2'
