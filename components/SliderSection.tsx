import { moodEmoji } from "@/constants/moodEmojis";
import Slider from "@react-native-community/slider";
import { View, Text, StyleSheet } from "react-native";

export function SliderSection({
  level,
  setLevel,
  newMoodInProgress,
  setNewMoodInProgress,
}: {
  level: number;
  setLevel: (v: number) => void;
  newMoodInProgress: boolean;
  setNewMoodInProgress: (v: boolean) => void;
}) {
  return (
    <View style={sliderStyles.sliderContainer}>
      <Text style={sliderStyles.emoji}>{moodEmoji(level)[0]}</Text>
      <Slider
        style={{ width: "90%", height: 40, borderColor: "black" }}
        minimumValue={0}
        maximumValue={5}
        step={1}
        value={level}
        onValueChange={setLevel}
        minimumTrackTintColor={newMoodInProgress ? "#14b8a6" : "#e5e7eb"}
        maximumTrackTintColor="#e5e7eb"
        thumbTintColor="#0d9488"
        onSlidingStart={(v) => setNewMoodInProgress(true)}
      />
      {/* <Text style={sliderStyles.levelLabel}>
        Use the slider select your emoji
      </Text> */}
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  levelLabel: {
    marginTop: 2,
    color: "gray",
    fontSize: 12,
    fontWeight: "light",
  },
});
