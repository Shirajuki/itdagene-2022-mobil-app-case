export default (counter: number) => {
    if (counter > 0 && counter < 15) {
        return 50;
    } else if (counter >= 15 && counter < 30) {
        return 30;
    } else if (counter >= 30 && counter < 50) {
        return 10;
    }
    return 1;
}