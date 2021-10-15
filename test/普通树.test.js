require('should')
const { 节点: 节点类, 树: 树类 } = require('../src/数据结构/树/普通树.class')

describe('普通树', function () {

    describe('创建', function () {
        it.only('节点', function () {
            const 根节点 = new 节点类({ 数据: { a: 'aa' } })
            const 树 = 树类.创建(
                {
                    数据: { a: 'aa' },
                    子节点集: [
                        { 数据: { b: 'bb' }, 子节点集: [{ 数据: 'bbb', 子节点集: [{ 数据: 'bbbb' }] }] },
                        { 数据: { c: 'cc' } },
                        { 数据: { d: 'dd' } },
                    ]
                })
            let 迭代器 = 树.根节点.取所有子节点()
            debugger
        })
    })
})