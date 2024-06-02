export const getSmallestHigherPowerOfTwo = (num: number) => {
    let power = 1;
    while (power < num) {
        power *= 2;
    }

    return power;
}