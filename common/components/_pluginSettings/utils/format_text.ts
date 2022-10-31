/**
 * It takes a string, splits it by "_" into an array of strings, capitalizes the first letter of each string,
 * and then joins the array back into a string
 * @returns A string with the first letter of each word capitalized.
 */
const format_string = text => {
    return text.split("_").map(e => e[0].toUpperCase() + e.slice(1)).join(' ')
}

export { format_string };