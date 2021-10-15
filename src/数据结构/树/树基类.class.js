class 节点基类 {
    constructor({ 数据, 父节点, 子节点集 = [] }) {
        if (!(this.__proto__ instanceof 节点基类)) throw new Error('必须存在继承于本基类的子类')
        if (父节点 && !(父节点.__proto__ instanceof 节点基类)) throw new Error('父节点不合法')

        this.数据 = 数据
        this.父节点 = 父节点
        this.子节点集 = 子节点集.map(子节点 => 子节点 instanceof this.constructor ?
            子节点 :
            new this.constructor(Object.assign(子节点, { 父节点: this })))
    }

    get 兄() {
        if (!this.父节点) return undefined
        const 当前节点序号 = this.父节点.子节点集.findIndex(兄弟节点 => 兄弟节点 === this)
        return this.父节点.子节点集[当前节点序号 - 1]
    }

    get 弟() {
        if (!this.父节点) return undefined
        const 当前节点序号 = this.父节点.子节点集.findIndex(兄弟节点 => 兄弟节点 === this)
        return this.父节点.子节点集[当前节点序号 + 1]
    }

    get 层() {
        let 层 = 0
        let 当前节点 = this
        while (当前节点 = 当前节点.父节点) {
            层++
        }

        return 层
    }

    get 是根节点吗() {
        return !this.父节点
    }

    get 是叶子节点吗() {
        return !!this.父节点 && !this.子节点集.length
    }

    *_深度优先迭代() { // 不用栈求，优势是迭代出来的节点可以被马上修改，修改的效果会应用在迭代器的后续迭代中
        let 当前节点 = this
        yield 当前节点

        let 回溯 = false // true向下， false 向上
        while (当前节点 && (!当前节点.是根节点吗 || !回溯)) { // 没有退回到根节点的情况下 继续迭代
            if (!当前节点.是叶子节点吗 && !回溯) {// 有子节点走子节点；回溯过程中意味着子树已被遍历，不找子节点
                当前节点 = 当前节点.子节点集[0]
            }
            else if (当前节点.弟) {
                当前节点 = 当前节点.弟
            }
            else {
                当前节点 = 当前节点.父节点
                回溯 = true
                continue // 打断 yield
            }

            回溯 = false
            yield 当前节点
        }
    }

    *_广度优先迭代() { // 不用队列求，优势是迭代出来的节点可以被马上修改，修改的效果会应用在迭代器的后续迭代中
        let 当前节点 = this
        let 指针层 = 0
        yield 当前节点

        let 回溯 = false // true向下， false 向上
        while (当前节点 && (!当前节点.是根节点吗 || !回溯)) { // 没有退回到根节点的情况下 继续迭代
            if (当前节点.弟) {
                当前节点 = 当前节点.弟
            }
            else if (!当前节点.是叶子节点吗 && !回溯) {// 有子节点走子节点；回溯过程中意味着子树已被遍历，不找子节点
                当前节点 = 当前节点.子节点集[0]
            }
            else {
                当前节点 = 当前节点.父节点
                回溯 = true
                continue // 打断 yield
            }

            回溯 = false
            yield 当前节点
        }
    }

    取所有子节点({ 包括自己 = true, 算法 = '' } = {}) {
        let 节点集 = []
        if (算法.includes('深度')) 算法 = '深度优先'
        else 算法 = '广度优先'

        let 迭代器 = this[`_${算法}迭代`]()
        let 下一个节点

        while (下一个节点 = 迭代器.next().value) {
            节点集.push(下一个节点)
        }

        return 节点集
    }
}

// 由于 树不呈现环状 所以一棵树中不会存在两个完全相同的节点
class 树基类 extends Set {

    static 创建(根节点数据) {
        if (Object.prototype.toString.call(根节点数据) != '[object Object]') throw new Error('节点不合法')

        return new this([根节点数据 instanceof 节点基类 ? 根节点数据 : new this.节点类(根节点数据)])
    }

    get 是空树吗() {
        return !this.size
    }

    get 转数组() {
        return Array.from(this)
    }

    get 根节点() {
        const 节点迭代器 = this.keys()
        let 循环完成 = false

        while (!循环完成) {
            const { value: 节点, done } = 节点迭代器.next()

            循环完成 = done
            if (节点.是根节点吗) return 节点
        }
    }

    get 叶子节点集() {
        return this.转数组.filter(节点 => !节点.子节点集.length)
    }

    get 所有节点() {
        return Object.create(this)
    }
}

module.exports = { 节点基类, 树基类 }