describe('Create element specs:', function() {
    var module = bucket;
    var elem;
    var text;

    describe('When we call with source', function() {
        beforeEach(function() {
           text = 'var foo = "bar"';
            elem = module.createElement(text);
        });

        it('Should be a script element', function() {
            expect(elem.tagName).toBe('SCRIPT');
        });

        it('Should be without defer', function() {
            expect(elem.defer).toBe(false);
        });

        it('Should be with innerText', function() {
            expect(elem.innerText).toBe(text);
        });
    });

    describe('When we call with source and defer', function() {
        beforeEach(function() {
            text = 'var foo = "bar"';
            elem = module.createElement(text, { defer: true });
        });

        it('Should be a script element', function() {
            expect(elem.tagName).toBe('SCRIPT');
        });

        it('Should be with defer', function() {
            expect(elem.defer).toBe(true);
        });

        it('Should be with innerText', function() {
            expect(elem.innerText).toBe(text);
        });
    });

    describe('When we call with source and style option', function() {
        beforeEach(function() {
            text = '.foo{}';
            elem = module.createElement(text, { style: true });
        });

        it('Should be a style element', function() {
            expect(elem.tagName).toBe('STYLE');
        });

        it('Should be with innerText', function() {
            expect(elem.innerText).toBe(text);
        });
    });

    describe('When we call with source and link option', function() {
        beforeEach(function() {
            text = '/foo/bar';
            elem = module.createElement(text, { link: true });
        });

        it('Should be a script element', function() {
            expect(elem.tagName).toBe('SCRIPT');
        });

        it('Should be with src', function() {
            expect(typeof elem.src).toBe('string');
        });
    });

    describe('When we call with source and link option and defer option', function() {
        beforeEach(function() {
            text = '/foo/bar';
            elem = module.createElement(text, { link: true, defer: true });
        });

        it('Should be a script element', function() {
            expect(elem.tagName).toBe('SCRIPT');
        });

        it('Should be with defer', function() {
            expect(elem.defer).toBe(true);
        });

        it('Should be with src', function() {
            expect(typeof elem.src).toBe('string');
        });
    });

    describe('When we call with source and style option and link option', function() {
        beforeEach(function() {
            text = '.foo{}';
            elem = module.createElement(text, { style: true, link: true });
        });

        it('Should be a script element', function() {
            expect(elem.tagName).toBe('LINK');
        });

        it('Should be stylesheet', function() {
            expect(elem.rel).toBe('stylesheet');
        });

        it('Should be with href', function() {
            expect(typeof elem.href).toBe('string');
        });
    });
});
