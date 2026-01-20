import {
  Button,
  FlatList,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { SliderSection } from "./SliderSection";
import { Mood } from "@/types/supabase";
import { useState } from "react";
import { MoodCard } from "./MoodCard";
import { moodEmoji } from "@/constants/moodEmojis";

export function MoodSection({
  mood,
  setMood,
  latestMood,
  allMoods,
  onSave,
  onDelete,
  editingId,
  setEditingId,
  level,
  setLevel,
}: {
  mood: string | null;
  setMood: (v: string | null) => void;
  latestMood: Mood | null;
  allMoods: Mood[];
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  editingId: number | null;
  setEditingId: (v: number | null) => void;
  level: number;
  setLevel: (v: number) => void;
}) {
  const [newMoodInProgress, setNewMoodInProgress] = useState(false);
  return (
    <>
      <View style={{ justifyContent: "center", marginBottom: 20 }}>
        <Text style={styles.title}>How are you feeling right now?</Text>
        <SliderSection
          newMoodInProgress={newMoodInProgress}
          setNewMoodInProgress={setNewMoodInProgress}
          level={level}
          setLevel={setLevel}
        />
        <TextInput
          style={styles.input}
          placeholder="What happened?"
          value={mood ? mood : undefined}
          onChangeText={setMood}
          returnKeyType="done"
          onSubmitEditing={onSave}
          autoFocus
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            disabled={!mood}
            title={editingId ? "Update Mood" : "Save Mood"}
            onPress={() => {
              onSave();
              setNewMoodInProgress(false);
            }}
          />
          {editingId ? (
            <Button
              title="Cancel"
              onPress={() => {
                setEditingId(null);
                setMood("");
                setLevel(4);
                setNewMoodInProgress(false);
              }}
            />
          ) : (
            ""
          )}
        </View>
        <Button
          disabled={!latestMood}
          title="Delete Latest Mood"
          onPress={() => {
            onDelete();
            setNewMoodInProgress(false);
          }}
        />
      </View>
      {latestMood && (
        <MoodCard
          text={latestMood.text}
          emoji={moodEmoji(latestMood.level)[0]}
          createdAt={latestMood.created_at}
          onPress={() => {
            setMood(latestMood.text);
            setEditingId(latestMood.id);
            setLevel(latestMood.level);
            setNewMoodInProgress(true);
          }}
        />
      )}

      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
        All Moods
      </Text>
      <FlatList
        data={allMoods}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        renderItem={({ item }) => (
          <MoodCard
            text={item.text}
            emoji={moodEmoji(item.level)[0]}
            createdAt={item.created_at}
            onPress={() => {
              setMood(item.text);
              setEditingId(item.id);
              setLevel(item.level);
              setNewMoodInProgress(true);
            }}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: "25%",
  },
  title: {
    fontSize: 18,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 16,
    textAlign: "center",
  },
});