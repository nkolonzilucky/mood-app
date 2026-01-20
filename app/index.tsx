import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  deleteMoodById,
  getAllMoods,
  getLastMood,
  insertMood,
  updateMoodById,
} from "@/api/mood";
import { Mood } from "@/types/supabase";
import { sendMagicLink } from "@/api/auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase";
import { MoodSection } from "@/components/MoodSection";



function LoginSection({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (v: string) => void;
}) {
  return (
    <View style={{ justifyContent: "center" }}>
      <Text style={{ marginBottom: 8, alignSelf: "center" }}>
        Login with email
      </Text>
      <TextInput
        style={styles.input}
        placeholder="your@email.example"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        title="Send magic link"
        onPress={async () => {
          try {
            await sendMagicLink(email);
            alert("Check your emails");
          } catch (error) {
            alert("Error while sending link");
            console.log(error);
          }
        }}
      />
    </View>
  );
}



const App = () => {
  const [mood, setMood] = useState<string | null>("");
  const [level, setLevel] = useState(4);
  const [latestMood, setLatestMood] = useState<Mood | null>(null);
  const [allMoods, setAllMoods] = useState<Mood[]>([]);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load latest mood when app opens

  useEffect(() => {
    loadLatestMood();
    loadAllMoods();
    getSession();
  }, []);

  async function getSession() {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    //Listen for future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }

  async function confirmDelete(id: number | undefined) {
    Alert.alert("Delete Mood?", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteMood(id),
      },
    ]);
  }

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
      if (editingId) {
        await updateMoodById(editingId, mood, level);
        setEditingId(null);
      } else {
        await insertMood(mood, level);
      }
      setMood("");
      setLevel(4);
      await loadAllMoods();
      await loadLatestMood();
    } catch (err) {
      alert("Error saving Mood");
      console.error(err);
    }
  }

  async function handleDeleteMood(id: number | undefined) {
    if (!latestMood || !id) return;
    try {
      await deleteMoodById(id);
      setLatestMood(null);
      setMood("");
      setLevel(4);
      setEditingId(null);
      loadLatestMood();
      loadAllMoods();
    } catch (error) {
      alert("Error deleting last mood");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      {session ? (
        <LoginSection email={email} setEmail={setEmail} />
      ) : (
        <MoodSection
          mood={mood}
          setMood={setMood}
          latestMood={latestMood}
          allMoods={allMoods}
          onSave={saveMood}
          onDelete={() => confirmDelete(latestMood?.id)}
          editingId={editingId}
          setEditingId={setEditingId}
          level={level}
          setLevel={setLevel}
        />
      )}
    </View>
  );
};


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

export default App;

