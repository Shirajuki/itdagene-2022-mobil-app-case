export default (array: {score: number, game: string}[]) => {
    return array.sort((a, b) => {
        return b.score - a.score;
    });
};
