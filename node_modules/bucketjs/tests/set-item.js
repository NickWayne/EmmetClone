describe('Set item specs:', function() {
    var module = bucket;
    var item;
    var KEY = 'bucket:key';

    afterEach(function() {
        try { localStorage.clear() } catch (err) {}
    });
    
    describe('When we call without option', function() {
        beforeEach(function() {
            module.setItem('key', 'ok');
            item = JSON.parse(localStorage.getItem(KEY));
        });

        it('Should have timestamp', function() {
            expect(typeof item.timestamp).toBe('number');
        });

        it('Should have data', function() {
            expect(item.data).toBe('ok');

        });

        it('Should have version equal null', function() {
            expect(item.version).toBe(null);
        });

        it('Should have expire equal 0', function() {
            expect(item.expire).toBe(0);
        });
    });

    describe('When we call with expire option', function() {
        beforeEach(function() {
            module.setItem('key', 'ok', { expire: 1 });
            item = JSON.parse(localStorage.getItem(KEY));
        });

        it('Should have timestamp', function() {
            expect(typeof item.timestamp).toBe('number');
        });

        it('Should have data', function() {
            expect(item.data).toBe('ok');

        });

        it('Should have version equal null', function() {
            expect(item.version).toBe(null);
        });

        it('Should have expire equal 1', function() {
            expect(item.expire).toBe(1);
        });
    });

    describe('When we call with version option', function() {
        beforeEach(function() {
            module.setItem('key', 'ok', { version: '1' });
            item = JSON.parse(localStorage.getItem(KEY));
        });

        it('Should have timestamp', function() {
            expect(typeof item.timestamp).toBe('number');
        });

        it('Should have data', function() {
            expect(item.data).toBe('ok');

        });

        it('Should have version equal 1', function() {
            expect(item.version).toBe('1');
        });

        it('Should have expire equal 0', function() {
            expect(item.expire).toBe(0);
        });
    });

    describe('When we call with version and expire options', function() {
        beforeEach(function() {
            module.setItem('key', 'ok', { version: '1', expire: 1 });
            item = JSON.parse(localStorage.getItem(KEY));
        });

        it('Should have timestamp', function() {
            expect(typeof item.timestamp).toBe('number');
        });

        it('Should have data', function() {
            expect(item.data).toBe('ok');

        });

        it('Should have version equal 1', function() {
            expect(item.version).toBe('1');
        });

        it('Should have expire equal 1', function() {
            expect(item.expire).toBe(1);
        });
    });
});
