/**
 * It returns the length of an array
 * @param {any[]} array - The array you want to get the length of.
 * @returns The length of the array
 */
const array_length = (array: any[]) => {
    let length = 0;
    for (let i in array) {
        length++
    }
    return length;
}

export { array_length }