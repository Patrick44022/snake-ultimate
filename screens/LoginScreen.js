
// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Konto erstellt', 'Du bist nun registriert!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Kalender');
      }
    } catch (error) {
      Alert.alert('Fehler', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Registrieren' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isRegistering ? 'Registrieren' : 'Einloggen'} onPress={handleAuth} />
      <Text style={styles.switch} onPress={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Bereits registriert? Login' : 'Noch kein Konto? Registrieren'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 12 },
  switch: { color: 'blue', marginTop: 16, textAlign: 'center' }
});
