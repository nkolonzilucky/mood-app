import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  deleteMoodById,
  getAllMoods,
  getLastMood,
  insertMood,
  updateMoodById,
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



const App = () => {
  const [mood, setMood] = useState("");
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
        await updateMoodById(editingId, mood);
        setEditingId(null);
      } else {
        await insertMood(mood);
      }
      setMood("");
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
        />
      )}
    </View>
  );
};

function MoodSection({
  mood,
  setMood,
  latestMood,
  allMoods,
  onSave,
  onDelete,
  editingId,
  setEditingId,
}: {
  mood: string;
  setMood: (v: string) => void;
  latestMood: Mood | null;
  allMoods: Mood[];
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  editingId: number | null;
  setEditingId: (v: number | null) => void;
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
          returnKeyType="done"
          onSubmitEditing={onSave}
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            disabled={!mood}
            title={editingId ? "Update Mood" : "Save Mood"}
            onPress={onSave}
          />
          {editingId ? (
            <Button
              title="Cancel"
              onPress={() => {
                setEditingId(null);
                setMood("");
              }}
            />
          ) : (
            ""
          )}
        </View>
        <Button
          disabled={!latestMood}
          title="Delete Latest Mood"
          onPress={onDelete}
        />
      </View>
      {latestMood && (
        <MoodCard
          text={latestMood.text}
          createdAt={latestMood.created_at}
          onPress={() => {
            setMood(latestMood.text);
            setEditingId(latestMood.id);
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
            createdAt={item.created_at}
            onPress={() => {
              setMood(item.text);
              setEditingId(item.id);
            }}
          />
        )}
      />
    </>
  );
}

function MoodCard({
  text,
  createdAt,
  onPress,
}: {
  text: string;
  createdAt: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={cardStyles.cardWrapper} onPress={onPress}>
      <View style={cardStyles.card}>
        <Text style={cardStyles.moodText}>{text}</Text>
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

