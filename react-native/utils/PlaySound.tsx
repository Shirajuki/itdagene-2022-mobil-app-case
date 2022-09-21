import {Audio, AVPlaybackStatus} from "expo-av";
import {useEffect, useState} from "react";
import {Sound} from "expo-av/build/Audio/Sound";

interface SoundInterface {
    sound: Sound;
    status: AVPlaybackStatus;
    playAsync: () => Promise<AVPlaybackStatus>;
    unloadAsync: () => Promise<AVPlaybackStatus>;
}

export async function PlaySound() {
    const [sound, setSound] = useState<SoundInterface>();

    const musicList = {
        lobby: "../assets/music/Lobby-Time.mp3",
        duck: "../assets/music/Fluffing-a-Duck.mp3",
        bicycle: "../assets/music/Komiku_-_12_-_Bicycle.mp3",
        monkey: "../assets/music/Monkeys-Spinning-Monkeys.mp3",
    }

    const temporarySound: SoundInterface = await Audio.Sound.createAsync(require("../assets/music/Fluffing-a-Duck.mp3"), {shouldPlay: true})
    setSound(temporarySound)

    await sound.playAsync();

    useEffect(() => {
        return sound
            ? () => {
                console.log("unloading");
                sound!.unloadAsync();
            }
            : undefined;
    }, [sound]);

}