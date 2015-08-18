(function () {

    var nil = void 0

    var Arr = Array
    var arr = Arr.prototype
    var arr_push =
        arr.push

    var Reg = RegExp
    var reg = Reg.prototype
    var reg_test =
        reg.test

    var Math_min =
        Math.min

    var Math_max =
        Math.max

    function Math_sum(/* ... */) {
        var total = arguments[0]
        for (var i = 1, l = arguments.length; i < l; i ++) total += arguments[i]
        return total
    }

    function Math_avg(/* ... */) {
        return Math_sum.apply(nil, arguments) / arguments.length
    }

    function Math_mean(/* ... */) {
        var args = []; arr_push.apply(args, arguments)
        return args.sort()[arguments.length >> 1]
    }

    function kink(/* ... */) {
        return kink.joined.apply(this, arguments)
    }

    kink.end = function (/* ... */) {
    }

    kink.pass = function (next) {
        return function (/* ... */) {
            next.apply(this, arguments)
        }
    }

    kink.join = function (/* ... */) {
        var row = []; arr_push.apply(row, arguments)
        return function (next) {
            var i = row.length
            while (i--) { next = row[i](next) }
            return next
        }
    }

    kink.joined = function (/* ... */) {
        return kink.join.apply(nil, arguments)(kink.end)
    }

    kink.firstFew = function (count) {
        return function (next) {
            return function (/* ... */) {
                var few = Array(count)
                for (var i = 0; i < count; i ++) few[i] = arguments[i]
                next.apply(this, few)
            }
        }
    }

    kink.first = kink.firstFew(1)

    kink.lastFew = function (count) {
        return function (next) {
            return function (/* ... */) {
                var few = Array(count), length = arguments.length
                for (var i = length - count; i < length; i ++)
                    few[i] = arguments[i]
                next.apply(this, few)
            }
        }
    }

    kink.last = kink.lastFew(1)

    kink.tap = function (proc) {
        return function (next) {
            return function (/* ... */) {
                proc.apply(this, arguments)
                next.apply(this, arguments)
            }
        }
    }

    kink.log = kink.tap(console.log.bind(console))

    kink.get = function (key) {
        return kink.map.each(function (object) { return object[key] })
    }

    kink.map = function (func) {
        return function (next) {
            return function (/* ... */) {
                next.call(this, func.apply(this, arguments))
            }
        }
    }

    kink.map.each = function (func) {
        return function (next) {
            return function (/* ... */) {
                for (var l = arguments.length, i = 0; i < l; i ++)
                    arguments[i] = func.call(this, arguments[i])
                next.apply(this, arguments)
            }
        }
    }

    kink.bundle = kink.map(function (/* ... */) {
        var args = []; arr_push.apply(args, arguments)
        return args
    })

    kink.group = function (count) {
        return function (next) {
            var i = 0, group = Array(count)
            return function (/* ... */) {
                for (var l = arguments.length, i = 0; i < l; i ++) {
                    group[i] = arguments[i]
                    i += 1
                    i %= count
                    if (0 === i) next.apply(this, group)
                }
            }
        }
    }

    kink.groups = function (count) {
        return kink.join(kink.bundle, kink.group(count))
    }

    kink.slide = function (count) {
        return function (next) {
            var slide = []
            return function (/* ... */) {
                for (var l = arguments.length, i = 0; i < l; i ++) {
                    slide.unshift(arguments[i])
                    if (slide.length > count) slide.pop()
                    next.apply(this, slide)
                }
            }
        }
    }

    kink.slides = function (count) {
        return kink.join(kink.bundle, kink.slide(count))
    }

    kink.moving = function (func) {
        return function (count) {
            return kink.join(kink.slide(count), kink.map(func))
        }
    }

    kink.mean = kink.moving(Math_mean)

    kink.avg = kink.average = kink.moving(Math_avg)

    kink.min = kink.minimum = kink.moving(Math_min)

    kink.max = kink.maximum = kink.moving(Math_max)

    kink.win = kink.window = function (ms) {
        return function (next) {
            var timeout, buffer = []
            return function (value) {
                buffer.push(value)
                clearTimeout(timeout)
                timeout = setTimeout(flush, ms)
                function flush() {
                    next.apply(nil, buffer)
                    buffer.splice(0, buffer.length)
                }
            }
        }
    }

    kink.parseInts = function (bits) {
        return kink.map.each(function (value) {
            return parseInt(value, bits)
        })
    }

    kink.parseIntegers = kink.parseInts(10)

    kink.parseFloats = kink.map.each(parseFloat)

    kink.toStrings = kink.map.each(function (value) {
        return value + ''
    })

    kink.search = function (pred) {
        return function (next) {
            return function (/* ... */) {
                if (pred.apply(this, arguments)) next.apply(this, arguments)
            }
        }
    }

    kink.search.each = function (pred) {
        return function (next) {
            var thru = []
            return function (/* ... */) {
                for (var l = arguments.length, i = 0; i < l; i ++) {
                    if (pred.call(this, arguments[i])) thru.push(arguments[i])
                }
                if (thru.length) {
                    next.apply(this, thru)
                    thru.splice(0, thru.length)
                }
            }
        }
    }

    kink.scan = function (regex) {
        return kink.search(reg_test.bind(regex))
    }

    kink.scan.each = function (regex) {
        return kink.search.each(reg_test.bind(regex))
    }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = kink
    }
    else {
        var root = typeof exports === 'object' ? exports
                 : typeof self    === 'object' && self.self === self ? self
                 : typeof global  === 'object' && global.global === global ? global
                 : this
        root.kink = kink
    }

})()
