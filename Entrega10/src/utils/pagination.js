
export function pagination(size, index, url) {
    // let result = {has_first_page: false, has_last_page: false, first_five: false, last_last_five: false, first: false, last: false, index}
    let result = {}
    let array = Array.from({ length: size }, (_, index) => index + 1);
    if(index < 0 || index > array.length) return false
    result.url = url
    if(array.length > 8 ) {
        if (index > 8) {
            const max = array.length - 5
            if (index < max) {
                const get_first_five = Array.from({ length: 2 }, (_, x) => index - x -1)
                get_first_five.sort((a, b) => a - b)
                result.first_five = get_first_five

                const get_last_five = Array.from({ length: 2 }, (_, x) => index + x +1)
                get_last_five.sort((a, b) => a - b)
                result.last_five = get_last_five
                result.has_first_page = true
                result.has_last_page = true
                result.index = index

                result.coso = 'a'
            } else {
                const get_last_five = Array.from({ length: array.length - index }, (_, x) => index + x +1)
                get_last_five.sort((a, b) => a - b)
                result.last_five = get_last_five

                const bofore_sequence = 6 - (array.length - index)
                if(bofore_sequence !== 0) {
                    const get_first_five = Array.from({ length: bofore_sequence }, (_, x) => index - x -1)
                    get_first_five.sort((a, b) => a - b)
                    result.first_five = get_first_five
                    result.cosob = 'b2'
                }
                result.has_first_page = true
                result.index = index
                result.coso = 'b'
            }
        } else {
            const get_last_five = Array.from({ length: 8 - index }, (_, x) => index + x + 1)
            get_last_five.sort((a, b) => a - b)
            result.last_five = get_last_five
            result.coso = 'c'
            if(index !== 1) {
                const get_first_five = Array.from({ length: index - 1 }, (_, x) => index - x -1)
                get_first_five.sort((a, b) => a - b)
                result.first_five = get_first_five
                result.cosob = 'c2'
            }
            result.index = index
        }

        result.last = array.length
    } else {
        result.first_five = array 
        result.coso = 'd'
    }
    result.active = index
    return result

}