describe('Get item specs:', function() {
    var module = bucket;
    var item;
    var KEY = 'bucket:key';

    afterEach(function() {
        try { localStorage.clear() } catch (err) {}
    });

    describe('When we haven`t cache and get without version', function() {
        it('Should be a null', function() {
            expect(module.getItem('key')).toBe(null);
        });
    });

    describe('When we have cache without version and get without version', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 0, timestamp: +new Date() - 10, version: null }));

            item = module.getItem('key');
        });

        it('Should be ok', function() {
            expect(item).toBe('ok');
        });
    });

    describe('When we have cache with version and get without version', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 0, version: '1', timestamp: +new Date() - 10 }));
            item = module.getItem('key');
        });

        it('Should be a null', function() {
            expect(item).toBe(null);
        });

        it('Should remove cache by key', function() {
            expect(localStorage.getItem(KEY)).toBe(null);
        });
    });

    describe('When we have cache with version and get with no match version', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 0, version: '1', timestamp: +new Date() - 10 }));
            item = module.getItem('key', '2');
        });

        it('Should be a null', function() {
            expect(item).toBe(null);
        });

        it('Should remove cache by key', function() {
            expect(localStorage.getItem(KEY)).toBe(null);
        });
    });

    describe('When we have cache with version and get with match version', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 0, version: '1', timestamp: +new Date() - 10 }));
            item = module.getItem('key', '1');
        });

        it('Should be ok', function() {
            expect(item).toBe('ok');
        });
    });

    describe('When we have cache without version and get with version', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 0, timestamp: +new Date() - 10, version: null }));

            item = module.getItem('key', '1');
        });

        it('Should be a null', function() {
            expect(item).toBe(null);
        });

        it('Should remove cache by key', function() {
            expect(localStorage.getItem(KEY)).toBe(null);
        });
    });

    describe('When we have cache with expire equal 10000ms and timestamp', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 10000, timestamp: +new Date() - 10, version: null }));
            item = module.getItem('key');
        });

        it('Should be ok', function() {
            expect(item).toBe('ok');
        });
    });

    describe('When we have cache with expire equal 1ms and timestamp', function() {
        beforeEach(function() {
            localStorage.setItem(
                KEY,
                JSON.stringify({ data: 'ok', expire: 1, timestamp: +new Date() - 10, version: null }));

            item = module.getItem('key');
        });

        it('Should be a null', function() {
            expect(item).toBe(null);
        });

        it('Should remove cache by key', function() {
            expect(localStorage.getItem(KEY)).toBe(null);
        });
    });
});
