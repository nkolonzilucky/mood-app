import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from "react";
import { getLastMood, insertMood } from "@/api/mood";
import { Mood } from "@/types/supabase";


const App = () => {
  const [mood, setMood] = useState("");
  const [latestMood, setLatestMood] = useState<Mood | null>(null);

  // Load latest mood when app opens

  useEffect(() => {
    loadLatestMood();
  }, []);

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
    } catch (err) {
      alert("Error saving Mood");
      console.error(err);
    }
  }
  return (
    <View style={styles.containers}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your mood ..."
        value={mood}
        onChangeText={setMood}
      />

      <Button title="Save Mood" onPress={saveMood} />

      {latestMood && (
        <Text style={{ marginTop: 20 }}>Last Mood: {latestMood.text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    containers: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        alignSelf: 'center'

    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 16,
        textAlign: 'center'
    }
});

export default App