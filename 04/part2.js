function validate(password) {
    password = '' + password
    var equalPair = false
    for (let i = 1; i < password.length; i++) {
        if (password.charAt(i) < password.charAt(i-1)) {
            return false
        }
        if (!equalPair && 
            password.charAt(i) == password.charAt(i-1) &&
            password.charAt(i+1) !== password.charAt(i) &&
            password.charAt(i-2) !== password.charAt(i-1)
        ) {
            equalPair = true
        }
    }
    return equalPair
}

function validPasswordsCount(from, to) {
    var count = 0
    for (let i = from; i <= to; i++) {
        if (validate(i)) {
            count++
        }
    }
    return count
}

console.log(
    validPasswordsCount(
        236491,
        713787,
    )
)