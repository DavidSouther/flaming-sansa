describe 'Graphing SVG', ->
    describe '`svg` directive', ->
        beforeEach module 'graphing.svg.svg'

        it 'Attaches dimensions to the scope on an `<svg>` element.', ->
            tag = 'svg'
            data = { }
            attrs = { style: "width: '250px'; height: '150px';" }

            element = renderElement tag, data, attrs
            $scope = element.scope()

            # TODO the offsetHeight and offsetWidth are zero, as the element
            # isn't attached to the DOM tree.
            # $scope.$width.should.equal 250
            # $scope.$height.should.equal 150

            $scope.$width.should.equal 0
            $scope.$height.should.equal 0
