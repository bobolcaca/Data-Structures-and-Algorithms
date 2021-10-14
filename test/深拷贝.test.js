require('should')
require('../src/拷贝/深拷贝')

describe('复制单一类型', function () {
    const 对比表 = {
        对象: { a: 1, b: '2' },
        Hash表: new Map([[1, 2], [2, 3]]),
        数组: [1, '2'],
        集合: new Set([1, '2', false]),
        函数: function fn() { console.log('我是一个函数') }
    }

    Object.entries(对比表).forEach(([测例名, 数据]) => {
        it(测例名, function () {
            const origin = 数据
            const target = origin.cloneDeep()

            origin.should.not.equal(target) // === 对比
            origin.should.eql(target) // 深度对比
        })
    })
})

describe('混合多种 Object 子类型', function () {
    const 对比表 = {
        混合: { a: 1, b: '2', c: [1, 2, { cc: 3, fn: function fn() { console.log('我是一个函数') } }, [4, 5], new Map([[1, 2], [2, [3]], ['3', { ccc: new Map([[6, 7]]) }]])] }
    }

    Object.entries(对比表).forEach(([测例名, 数据]) => {
        it(测例名, function () {
            const origin = 数据
            const target = origin.cloneDeep()

            origin.should.not.equal(target) // === 对比
            origin.should.eql(target) // 深度对比

            origin.c.should.not.equal(target) // === 对比
            origin.c.should.eql(target.c) // 深度对比

            origin.c[2].should.not.equal(target) // === 对比
            origin.c[2].should.eql(target.c[2]) // 深度对比

            origin.c[3].should.not.equal(target) // === 对比
            origin.c[3].should.eql(target.c[3]) // 深度对比

        })
    })
})

describe('循环调用', function () {
    // 循环调用1
    const array_key = ['ak']
    const map = new Map()
    const _map = new Map()
    _map.set('f', { ff: 'fff' })
    _map.set(array_key, [1, '2', { g: { gg: 'ggg' }, f: map }]) // map、_map 循环调用
    map.set('c', 'cc')
    map.set('d', 'dd')
    map.set('e', _map)

    // 循环调用2
    const a = {}
    const b = { a }
    a.b = b

    // 循环调用3
    function fn(val) { console.log(val) }
    fn.fn = fn

    const 对比表 = {
        循环调用1: [1, 2, [3, 4, [5], { num: 6 }], { aa: 1, b: [2, 3] }, map],
        循环调用2: a,
        循环调用3: fn
    }

    Object.entries(对比表).forEach(([测例名, 数据]) => {
        it(测例名, function () {
            const origin = 数据
            const target = origin.cloneDeep()

            origin.should.not.equal(target) // === 对比

            switch (测例名) {
                case '循环调用1':
                    origin[4].should.equal(origin[4].get('e').get(array_key)[2].f)
                    target[4].should.equal(target[4].get('e').get(array_key)[2].f)

                    origin[4].should.not.equal(target[4].get('e').get(array_key)[2].f)
                    origin[4].should.eql(target[4].get('e').get(array_key)[2].f)
                    break;

                case '循环调用2':
                    origin.should.equal(origin.b.a)
                    target.should.equal(target.b.a)

                    origin.should.eql(target)
                    origin.should.not.equal(target)
                    break;

                case '循环调用3':
                    origin.should.equal(origin.fn)
                    target.should.equal(target.fn)

                    origin.should.eql(target)
                    origin.should.not.equal(target)

                default:

                    break;
            }


        })
    })
})