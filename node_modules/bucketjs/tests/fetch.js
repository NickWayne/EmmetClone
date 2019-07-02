describe('Fetch specs:', function() {
    var module = bucket;

    jasmine.Ajax.install();

    var spy = jasmine.createSpy('spy');
    var request;

    afterEach(function() {
        spy.calls.reset();
        jasmine.Ajax.requests.reset();
    });

    describe('When we call without callback', function() {
        it('Should throw error', function() {
            expect(function() { module.fetch('/static/test.js', {}); }).toThrow();
        });
    });

    describe('When we call with bad callback argument', function() {
        it('Should throw error', function() {
            expect(function() { module.fetch('/static/test.js', {}, {}); }).toThrow();
        });
    });

    describe('When we call with callback as second argument', function() {
        beforeEach(function(done) {
            module.fetch('/static/test.js', function() {
                spy();
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        it('Should call done callback', function() {
            expect(spy).toHaveBeenCalled();
        });
    });


    describe('When we call with callback as third argument', function() {
        beforeEach(function(done) {
            module.fetch('/static/test.js', {}, function() {
                spy();
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        it('Should call done callback', function() {
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('When server answer with 200', function() {
        beforeEach(function(done) {
            module.fetch('/static/test.js', function(err, result) {
                spy(err, result);
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        it('Should make request', function() {
            expect(jasmine.Ajax.requests.mostRecent()).toBeDefined();
        });

        it('Should call done callback with null as first argument', function() {
            expect(spy.calls.argsFor(0)[0]).toBe(false);
        });

        it('Should call done callback with response as second argument', function() {
            expect(spy.calls.argsFor(0)[1]).toBe('ok');
        });
    });

    describe('When server answer with not 200 status', function() {
        beforeEach(function(done) {
            module.fetch('/static/test.js', function(err, result) {
                spy(err, result);
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 404, responseText: 'ok' });
        });


        it('Should`t make request', function() {
            expect(jasmine.Ajax.requests.mostRecent()).toBeDefined();
        });

        it('Should call callback with true as first argument', function() {
            expect(spy.calls.argsFor(0)[0]).toBe(true);
        });
    });

    describe('When we call with timeout and server don`t answer', function() {
        beforeEach(function(done) {
            module.fetch('/static/test.js', { timeout: 5 }, function(err, result) {
                spy(err, result);
                done();
            });
        });

        it('Should call callback with true as first argument', function() {
            expect(spy.calls.argsFor(0)[0]).toBe(true);
        });
    });

    // TODO: add test for option.timeout = undefined;
});
