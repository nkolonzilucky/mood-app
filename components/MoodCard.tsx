import { formatDate } from "@/utils/date";
import { Pressable, View, Text, StyleSheet } from "react-native";

export function MoodCard({
  text,
  emoji,
  createdAt,
  onPress,
}: {
  text: string | null;
  emoji: string;
  createdAt: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={cardStyles.cardWrapper} onPress={onPress}>
      <View style={cardStyles.card}>
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
        <Text style={cardStyles.moodText}>{text || "No reflection"}</Text>
        <Text style={cardStyles.timeText}>{formatDate(createdAt)}</Text>
        <Text style={cardStyles.tapHint}>Tap to Edit</Text>
      </View>
    </Pressable>
  );
}


const cardStyles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 8,
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#2dd4bf", //bright teal
    borderWidth: 1,
    borderColor: "#0ec4b5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  moodText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  timeText: {
    color: "#e6fffa", //very light teal
    fontSize: 12,
    marginBottom: 8,
  },
  tapHint: {
    color: "#ccfbf1",
    fontSize: 11,
    opacity: 0.8,
  },
});
