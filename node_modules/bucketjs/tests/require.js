describe('Require specs:', function() {
    var module = bucket;

    var spy = jasmine.createSpy('spy');
    var request;

    jasmine.Ajax.install();

    beforeEach(function() {
        spyOn(module, 'fetch').and.callThrough();
        spyOn(module, 'append').and.callThrough();
        module.append.and.stub();
    });

    afterEach(function() {
        localStorage.clear();
    });

    describe('When we call with one argument', function() {
        beforeEach(function() {
            module.require('/static/test.js');

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        describe('Then request', function() {
            it('Should not be sync', function() {
                expect(!!module.fetch.calls.mostRecent().args[1].sync).toBe(false);
            });

            it('Should be with timeout 5000', function() {
                expect(module.fetch.calls.mostRecent().args[1].timeout).toBe(5000);
            });
        });

        describe('Then resource', function() {
            it('Should be appended', function() {
                expect(!!module.append.calls.mostRecent().args[0]).toBeDefined();
            });

            it('Should be append to head', function() {
                expect(!!module.append.calls.mostRecent().args[1]).toBe(false);
            });
        });
    });

    describe('When we call with callback as second argument', function() {
        var callback = { done: function() {} } ;

        beforeEach(function(done) {
            spyOn(callback, 'done');

            module.require('/static/test.js', function() {
                callback.done();
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        describe('Then request', function() {
            it('Should not be sync', function() {
                expect(!!module.fetch.calls.mostRecent().args[1].sync).toBe(false);
            });

            it('Should be with timeout 5000', function() {
                expect(module.fetch.calls.mostRecent().args[1].timeout).toBe(5000);
            });
        });

        describe('Then resource', function() {
            it('Should be appended', function() {
                expect(!!module.append.calls.mostRecent().args[0]).toBeDefined();
            });

            it('Should be append to head', function() {
                expect(!!module.append.calls.mostRecent().args[1]).toBe(false);
            });
        });

        describe('Then done callback', function() {
            it('Should be called', function() {
                expect(callback.done).toHaveBeenCalled();
            });
        });
    });

    describe('When we call with key option and haven`t cache', function() {
        beforeEach(function(done) {
            spyOn(module, 'setItem').and.callThrough();
            spyOn(module, 'getItem').and.callThrough();
 
             module.require('/static/test.js', { key: 'test' }, function() {
                 done();
             });
 
             request = jasmine.Ajax.requests.mostRecent();
             request.response({ status: 200, responseText: 'ok' });
         });

        describe('Then getItem', function() {
            it('Should be called with key from options', function() {
                expect(module.getItem.calls.mostRecent().args[0]).toBe('test');
            });
        });

        describe('Then setItem', function() {
            it('Should be called with key from options', function() {
                expect(module.setItem.calls.mostRecent().args[0]).toBe('test');
            });
        });
    });

    describe('When we call with key option and have cache', function() {
        beforeEach(function(done) {
            spyOn(module, 'getItem').and.callThrough();

            module.require('/static/test.js', { key: 'test' }, function() {
                module.require('/static/test.js', { key: 'test' }, function() {
                    done();
                });
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        describe('Then getItem', function() {
            it('Should be called with key from options', function() {
                expect(module.getItem.calls.mostRecent().args[0]).toBe('test');
            });
        });
    });

    describe('When we require *.css file and have defer option', function() {
        describe('Then method', function() {
            var method;

            beforeEach(function() {
                method = function() {
                    module.require('/static/test.css', { defer: true });
                };
            });

            it('Should throw error', function() {
                expect(method).toThrow();
            });
        });
    });

    describe('When we require file with expire option and haven`t cache', function() {
        beforeEach(function(done) {
            spyOn(module, 'setItem').and.callThrough();

            module.require('/static/test.js', { expire: 5 }, function() {
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.response({ status: 200, responseText: 'ok' });
        });

        describe('Then setItem', function() {
            it('Should be called with expire option', function() {
                expect(module.setItem.calls.mostRecent().args[2].expire).toBe(5);
            });
        });
    });

    describe('When we require file with version and haven`t cache', function() {
        beforeEach(function(done) {
            spyOn(module, 'setItem').and.callThrough();

            module.require('/static/test.js', { version: 'new' }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then setItem', function() {
            it('Should be called with version option', function() {
                expect(module.setItem.calls.mostRecent().args[2].version).toBe('new');
            });
        });
    });

    describe('When we require file with version and have cache', function() {
        describe('Then getItem', function() {
            beforeEach(function(done) {
                spyOn(module, 'getItem').and.callThrough();

                module.require('/static/test.js', { version: 'new' }, function() {
                    module.require('/static/test.js', { version: 'new2' }, function() {
                        done();
                    });

                    jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok2' });
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.response({ status: 200, responseText: 'ok' });
            });

            it('Should be called with version argument', function() {
                expect(module.getItem.calls.mostRecent().args[1]).toBe('new2');
            });
        });
    });

    describe('When we haven`t cache and require *.js file', function() {
        describe('Then fist argument of append method', function() {
            var elem;

            beforeEach(function(done) {
                module.require('/static/test.js', { key: 'test' }, function() {
                    elem = module.append.calls.mostRecent().args[0];
                    done();
                });
    
                jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            });
            
            it('Should be script', function() {
                expect(elem.tagName).toBe('SCRIPT');
            });

            it('Should be without defer', function() {
                expect(elem.defer).toBe(false);
            });
        });
    });

    describe('When we haven`t cache and require *.js file and have defer option', function() {
        describe('Then fist argument of append method', function() {
            var elem;

            beforeEach(function(done) {
                module.require('/static/test.js', { key: 'test', defer: true }, function() {
                    elem = module.append.calls.mostRecent().args[0];
                    done();
                });

                jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            });

            it('Should be with defer', function() {
                expect(elem.defer).toBe(true);
            });
        });
    });

    describe('When we haven`t cache and require *.js file and have bottom option', function() {
        describe('Then second argument of append method', function() {
            var bottom;

            beforeEach(function(done) {
                module.require('/static/test.js', { key: 'test', bottom: true }, function() {
                    bottom = module.append.calls.mostRecent().args[1];
                    done();
                });

                jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            });

            it('Should be true', function() {
                expect(bottom).toBe(true);
            });
        });
    });

    describe('When we haven`t cache and require *.css file', function() {
        describe('Then fist argument of append method', function() {
            var elem;

            beforeEach(function(done) {
                module.require('/static/test.css', { key: 'test' }, function() {
                    elem = module.append.calls.mostRecent().args[0];
                    done();
                });

                jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            });

            it('Should be style', function() {
                expect(elem.tagName).toBe('STYLE');
            });
        });
    });

    describe('When we haven`t cache and require *.css file and have bottom option', function() {
        describe('Then second argument of append method', function() {
            var bottom;

            beforeEach(function(done) {
                module.require('/static/test.css', { key: 'test', bottom: true }, function() {
                    bottom = module.append.calls.mostRecent().args[1];
                    done();
                });

                jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            });

            it('Should be true', function() {
                expect(bottom).toBe(true);
            });
        });
    });

    describe('When we have cache and require *.js file', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test' }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then fist argument of append method', function() {
            var elem;

            beforeEach(function(done) {
                module.require('/static/test.js', { key: 'test' }, function() {
                    elem = module.append.calls.mostRecent().args[0];
                    done();
                });
            });

            it('Should be script', function() {
                expect(elem.tagName).toBe('SCRIPT');
            });

            it('Should be without defer', function() {
                expect(elem.defer).toBe(false);
            });
        });
    });

    describe('When we have cache and require *.js file and have defer option', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test' }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then fist argument of append method', function() {
            var elem;

            beforeEach(function(done) {
                module.require('/static/test.js', { key: 'test', defer: true }, function() {
                    elem = module.append.calls.mostRecent().args[0];
                    done();
                });
            });

            it('Should be with defer', function() {
                expect(elem.defer).toBe(true);
            });
        });
    });

    describe('When we have cache and require *.js file and have bottom option', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test' }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then second argument of append method', function() {
            var bottom;

            beforeEach(function(done) {
                module.require('/static/test.js', { key: 'test', bottom: true }, function() {
                    bottom = module.append.calls.mostRecent().args[1];
                    done();
                });
            });

            it('Should be true', function() {
                expect(bottom).toBe(true);
            });
        });
    });

    describe('When we have cache and require *.css file', function() {
        beforeEach(function(done) {
            module.require('/static/test.css', { key: 'test' }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then fist argument of append method', function() {
            var elem;

            beforeEach(function(done) {
                module.require('/static/test.css', { key: 'test' }, function() {
                    elem = module.append.calls.mostRecent().args[0];
                    done();
                });
            });

            it('Should be style', function() {
                expect(elem.tagName).toBe('STYLE');
            });
        });
    });

    describe('When we have cache and require *.css file and have bottom option', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test' }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then second argument of append method', function() {
            var bottom;

            beforeEach(function(done) {
                module.require('/static/test.css', { key: 'test', bottom: true }, function() {
                    bottom = module.append.calls.mostRecent().args[1];
                    done();
                });
            });

            it('Should be true', function() {
                expect(bottom).toBe(true);
            });
        });
    });

    describe('When we require *.js file and catch err during request', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test', timeout: 1 }, function() {
                done();
            });
        });

        describe('Then script', function() {
            it('Should be append with src attribute', function() {
                expect(/\/static\/test\.js/.test(module.append.calls.mostRecent().args[0].src)).toBe(true);
            });
        });
    });

    describe('When we require *.js file and catch err during request and have defer option', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test', timeout: 1, defer: true }, function() {
                done();
            });
        });

        describe('Then script', function() {
            it('Should be append with defer attribute', function() {
                expect(module.append.calls.mostRecent().args[0].defer).toBe(true);
            });
        });
    });

    describe('When we require *.js file and catch err during request and have bottom', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test', timeout: 1, bottom: true }, function() {
                done();
            });
        });

        describe('Then script', function() {
            it('Should be append with src attribute', function() {
                expect(/\/static\/test\.js/.test(module.append.calls.mostRecent().args[0].src)).toBe(true);
            });

            it('Should be append to body', function() {
                expect(module.append.calls.mostRecent().args[1]).toBe(true);

            });
        });
    });

    describe('When we require *.css file and catch err during request', function() {
        beforeEach(function(done) {
            module.require('/static/test.css', { key: 'test', timeout: 1 }, function() {
                done();
            });
        });

        describe('Then style', function() {
            it('Should be append with as link tag', function() {
                expect(module.append.calls.mostRecent().args[0].tagName).toBe("LINK");
            });
        });
    });

    describe('When we require *.css file and catch err during request and have bottom', function() {
        beforeEach(function(done) {
            module.require('/static/test.css', { key: 'test', timeout: 1, bottom: true }, function() {
                done();
            });
        });

        describe('Then style', function() {
            it('Should be append with as link tag', function() {
                expect(module.append.calls.mostRecent().args[0].tagName).toBe("LINK");
            });

            it('Should be append to body', function() {
                expect(module.append.calls.mostRecent().args[1]).toBe(true);
            });
        });
    });
    
    describe('When we require *.js file with link option', function() {
        beforeEach(function(done) {
            spyOn(module, 'setItem').and.callThrough();
            spyOn(module, 'getItem').and.callThrough();

            module.require('/static/test.js', { key: 'test', link: true }, function() {
                done();
            });
        });

        describe('Then script', function() {
            it('Should be append with src attribute', function() {
                expect(/\/static\/test\.js/.test(module.append.calls.mostRecent().args[0].src)).toBe(true);
            });
        });
        
        describe('Then getItem method', function() {
            it('Should not be called', function() {
                expect(module.getItem).not.toHaveBeenCalled();
            });
        });
        
        describe('Then setItem', function() {
            it('Should not be called', function() {
                expect(module.setItem).not.toHaveBeenCalled();
            });
        });

        describe('Then fetch', function() {
            it('Should not be called', function() {
                expect(module.fetch).not.toHaveBeenCalled();
            });
        });
    });

    describe('When we require *.css file with link option', function() {
        beforeEach(function(done) {
            spyOn(module, 'setItem').and.callThrough();
            spyOn(module, 'getItem').and.callThrough();

            module.require('/static/test.css', { key: 'test', link: true }, function() {
                done();
            });
        });

        describe('Then style', function() {
            it('Should be append as link', function() {
                expect(module.append.calls.mostRecent().args[0].tagName).toBe('LINK');
            });
        });

        describe('Then getItem method', function() {
            it('Should not be called', function() {
                expect(module.getItem).not.toHaveBeenCalled();
            });
        });

        describe('Then setItem', function() {
            it('Should not be called', function() {
                expect(module.setItem).not.toHaveBeenCalled();
            });
        });

        describe('Then fetch', function() {
            it('Should not be called', function() {
                expect(module.fetch).not.toHaveBeenCalled();
            });
        });
    });
    
    describe('When we require *.js file with one waitFor option', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test', waitFor: ['test2'] }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });

            module.require('/static/test.css', { key: 'test2' });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then resource', function() {
            it('Should be append after required resource', function() {
                expect(module.append.calls.argsFor(1)[0].tagName).toBe('SCRIPT');
            });
        });
    });

    describe('When we require *.js file with two waitFor option', function() {
        beforeEach(function(done) {
            module.require('/static/test.js', { key: 'test', waitFor: ['test2', 'test3'] }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });

            module.require('/static/test.css', { key: 'test2' });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });

            module.require('/static/test.css', { key: 'test3' });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then resource', function() {
            it('Should be append after required resources', function() {
                expect(module.append.calls.argsFor(2)[0].tagName).toBe('SCRIPT');
            });
        });
    });

    describe('When we require *.js file with cross waitFor', function() {
        var fn;

        beforeEach(function() {
            module.require('/static/test.css', { key: 'test', waitFor: ['test2'] });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });

            fn = function() {
                module.require('/static/test.css', { key: 'test2', waitFor: ['test'] });
                jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            };
        });

        describe('Then require method', function() {
            it('Should throw error', function() {
                expect(fn).toThrow();
            });
        });
    });
    
    describe('When we require resource after required resources is already invoked', function() {
        beforeEach(function(done) {
            module.require('/static/test.css', { key: 'test2' });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
            
            module.require('/static/test.js', { key: 'test', waitFor: ['test2'] }, function() {
                done();
            });

            jasmine.Ajax.requests.mostRecent().response({ status: 200, responseText: 'ok' });
        });

        describe('Then resource', function() {
            it('Should be append after required resources', function() {
                expect(module.append.calls.argsFor(1)[0].tagName).toBe('SCRIPT');
            });
        });
    });
});


