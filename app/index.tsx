import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  deleteMoodById,
  getAllMoods,
  getLastMood,
  insertMood,
} from "@/api/mood";
import { Mood } from "@/types/supabase";
import { formatDate } from "@/utils/date";

const App = () => {
  const [mood, setMood] = useState("");
  const [latestMood, setLatestMood] = useState<Mood | null>(null);
  const [allMoods, setAllMoods] = useState<Mood[]>([]);

  // Load latest mood when app opens

  useEffect(() => {
    loadLatestMood();
    loadAllMoods();
  }, []);

  async function loadAllMoods() {
    try {
      const data = await getAllMoods();
      setAllMoods(data);
    } catch (err) {
      alert("Error while fetching moods");
      console.log(err);
    }
  }

  async function loadLatestMood() {
    try {
      const results = await getLastMood();
      setLatestMood(results);
    } catch (err) {
      alert("Error fetching latest mood");
      console.log(err);
    }
  }

  async function saveMood() {
    try {
      await insertMood(mood);
      alert("Mood saved!");
      setMood("");
      await loadAllMoods();
      await loadLatestMood();
    } catch (err) {
      alert("Error saving Mood");
      console.error(err);
    }
  }

  async function handleDeleteMood() {
    if (!latestMood) return;
    try {
      await deleteMoodById(latestMood.id);
      setLatestMood(null);
      alert("Last Mood deleted successfully");
    } catch (error) {
      alert("Error deleting last mood");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: "50%" }}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your mood ..."
          value={mood}
          onChangeText={setMood}
        />

        <Button title="Save Mood" onPress={saveMood} />

        {latestMood && (
          <View>
            <Text style={{ marginTop: 20 }}>
              Last Mood: {latestMood.text} {"\n"} At:{" "}
              {formatDate(latestMood.created_at)}
            </Text>
            <Button title="Delete Last Mood" onPress={handleDeleteMood} />
          </View>
        )}
      </View>
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>All Moods</Text>
      <FlatList
        data={allMoods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 4 }}>
            • {item.text} - {formatDate(item.created_at)}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
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

export default App;
