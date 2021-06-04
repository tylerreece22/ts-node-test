interface Monkey {
    food: 'banana' | 'bug'
    greet: () => void
    climbSpeed: 'fast' | 'medium' | 'slow'
}

const monkey: Monkey = {food: "banana", greet: () => console.log('ooh ooh'), climbSpeed: "fast"}
monkey.greet()