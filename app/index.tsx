import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { insertMood } from "@/api/mood";


const App = () => {
    const [mood, setMood] = useState("");

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
              placeholder='Write your mood ...'
              value={mood}
              onChangeText={setMood}
          />

          <Button title='Save Mood' onPress={saveMood} />

    </View>
  )
}

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