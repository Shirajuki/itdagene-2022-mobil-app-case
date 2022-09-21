import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStorageService = async (type: 'SET' | 'GET', data?: {
    score: number;
    game: "G" | "B" | "W";
}) => {
    if (type === 'SET') {
        const storedData = await AsyncStorage.getItem('@scoreKey');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            parsedData.push(data);
            await AsyncStorage.setItem('@scoreKey', JSON.stringify(parsedData));
        } else {
            const newArrayOfData = [data];
            await AsyncStorage.setItem('@scoreKey', JSON.stringify(newArrayOfData));
        }
    } else if (type === 'GET') {
        const storedData = await AsyncStorage.getItem('@scoreKey');
        if (storedData) {
            return JSON.parse(storedData);
        }
    }
}

export default asyncStorageService;