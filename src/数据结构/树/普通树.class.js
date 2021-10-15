const { 节点基类, 树基类 } = require('./树基类.class')

class 节点 extends 节点基类 {
}

class 树 extends 树基类 {
    static 节点类 = 节点
}

module.exports = { 节点, 树 }