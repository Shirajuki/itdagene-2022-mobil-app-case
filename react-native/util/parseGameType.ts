export default (gameType: string) => {
    switch (gameType) {
        case "G":
        return "Gibberish";
        case "W":
        return "Nordle";
        case "B":
        return "Behind The Box";
    }
}