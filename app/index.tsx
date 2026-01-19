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
import { sendMagicLink } from "@/api/auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase";


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

function MoodSection({
  mood,
  setMood,
  latestMood,
  allMoods,
  onSave,
  onDelete,
}: {
  mood: string;
  setMood: (v: string) => void;
  latestMood: Mood | null;
  allMoods: Mood[];
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  return (
    <>
      <View style={{ justifyContent: "center", marginBottom: 20 }}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your mood..."
          value={mood}
          onChangeText={setMood}
        />
        <Button title="Save Mood" onPress={onSave} />
        <Button title="Delete Latest Mood" onPress={onDelete} />
      </View>
      {latestMood && (
        <Text style={{ marginBottom: 20 }}>
          Last Mood {latestMood.text} {"\n"} At:{" "}
          {formatDate(latestMood.created_at)}
        </Text>
      )}

      <Text style={{ fontWeight: "bold" }}>All Moods</Text>
      <FlatList
        data={allMoods}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 4 }}>
            • {item.text} - {formatDate(item.created_at)}
          </Text>
        )}
      />
    </>
  );
}

const App = () => {
  const [mood, setMood] = useState("");
  const [latestMood, setLatestMood] = useState<Mood | null>(null);
  const [allMoods, setAllMoods] = useState<Mood[]>([]);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);

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
      {!session ? (
        <LoginSection email={email} setEmail={setEmail} />
      ) : (
        <MoodSection
          mood={mood}
          setMood={setMood}
          latestMood={latestMood}
          allMoods={allMoods}
          onSave={saveMood}
          onDelete={handleDeleteMood}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: "50%",
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

