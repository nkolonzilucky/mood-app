import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '@/supabase'

const AuthScreen = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function signIn() {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        setLoading(false)

        if (error) {
            setError(error.message)            
        } else {
            onAuthSuccess()
        }
    }

    async function signUp() {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password
        })

        setLoading(false)

        if (error) {
          setError(error.message);
          alert("There was an error signing up");
        } else {
          onAuthSuccess();
          alert(
            "Account created successfully. Supabase has sent the confirmation link to the provided email address. Login is allowed after email confirmation.",
          );
        }

    }
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 16, alignSelf: "center" }}>
        Mood Tracker Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>}

      <Button title={loading ? "Signing in..." : "Sign In"} onPress={signIn} />
      <Button title="Create Account" onPress={signUp} />
    </View>
  );
}

export default AuthScreen

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    textAlign: "center",
  },
});