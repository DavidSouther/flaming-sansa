describe 'Graphing SVG', ->
    describe '`radius` directive', ->
        beforeEach module 'graphing.svg.radius'

        it 'Attaches an `r` attribute to a `<circle>` element.', ->
            tag = 'circle'
            data = { $r: 1}
            attrs = { radius: "$r"}
            element = renderElement tag, data, attrs
            element.attr('r').should.equal '1'
