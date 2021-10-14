
Object.prototype.for = function (cb) {
    if (Array.isArray(this) || this instanceof Set) {
        this.forEach(cb)
    } else if (this instanceof Map) {
        ([...this]).forEach(([key, val]) => cb(val, key))
    }
    else if (this instanceof Object) {
        Object.entries(this).forEach(([key, val]) => cb(val, key))
    }
}


// 只给 Object 原型链上添加 cloneDeep 方法，避免不合规定的数据使用
// CLONED_MAP：循环调用缓存区 避免循环引用
Object.prototype.cloneDeep = function (CLONED_MAP = new WeakMap()) {

    // 循环调用缓存区有目标值
    if (CLONED_MAP.has(this)) return CLONED_MAP.get(this)

    function _insert(parent, child, child_key) {
        if (!parent) return

        if (Array.isArray(parent)) {
            parent[child_key] = child
        }
        // Map
        else if (parent instanceof Map) {
            parent.set(child_key, child)
        }
        // Set
        else if (parent instanceof Set) {
            parent.add(child)
        }
        // Object
        else if (parent instanceof Object) {
            parent[child_key] = child
        }
    }

    // 克隆方法 递归入口
    function _clone(data) {
        return ['object', 'function'].includes(typeof data) ? data.cloneDeep(CLONED_MAP) : data
    }


    switch (typeof this) {
        case 'object':
            const new_obj = new this.constructor
            CLONED_MAP.set(this, new_obj)
            this.for((val, key) => {
                _insert(new_obj, _clone(val), key)
            })
            return new_obj
        case 'function':
            eval(`var copy_fn = ${this.toString()}`) // 复制方法体

            CLONED_MAP.set(this, copy_fn)
            for (let arg_key in this) { // 复制方法体参数
                if (!['for', 'cloneDeep'].includes(arg_key)) copy_fn[arg_key] = _clone(this[arg_key])
            }
            return copy_fn

        default:
            break;
    }
}