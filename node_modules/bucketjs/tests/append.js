describe('Append specs:', function() {
    var module = bucket;
    var findLastScript = function (inNode) {
        var nodes = (document[inNode] || document.getElementsByTagName(inNode)[0]).getElementsByTagName('script');

        return nodes[nodes.length - 1];
    };

    var elem = document.createElement('script');
    var script = 'var foo = "bar"';

    elem.text = script;

    describe('When call without bottom', function() {
        beforeEach(function() {
            module.append(elem);
        });

        it('Should append to head', function() {
            expect(findLastScript('head').innerText).toBe(script);
        });
    });

    describe('When call with bottom', function() {
        beforeEach(function() {
            module.append(elem, true);
        });

        it('Should append to body', function() {
            expect(findLastScript('body').innerText).toBe(script);
        });
    });
});
