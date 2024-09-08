import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure correct path to firebaseConfig

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Successfully logged in
        Alert.alert('Success', 'Logged in successfully');
      })
      .catch((error) => {
        // Error logging in
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logoText.png')} style={styles.logo} />

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Don't have an account?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccountScreen')}>
        <Text style={styles.linkText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 350, // Increased width for larger logo
    height: 150, // Increased height to maintain aspect ratio
    resizeMode: 'contain', // Ensures the image fits within the view without being distorted
    alignSelf: 'center',
    marginTop: -50, // Moves the logo higher on the screen
    marginBottom: 50, // Space between the logo and the input fields
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#00796B',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  linkText: {
    textAlign: 'center',
    color: '#00796B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
