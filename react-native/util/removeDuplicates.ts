export default (array: {score: number, game: string}[]) => {
    return array.filter((item, index, self) => {
        return index === self.findIndex((t) => {
            return t.game === item.game && t.score === item.score;; 
        });
    });
}