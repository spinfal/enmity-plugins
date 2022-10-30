const array_length = (array: any[]) => {
    let length = 0;
    for (let i in array) {
        length++
    }
    return length;
}

export { array_length }