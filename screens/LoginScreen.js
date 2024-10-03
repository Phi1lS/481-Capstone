import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, useColorScheme } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage'; // Import Firebase storage
import { auth, storage } from '../firebaseConfig'; // Ensure correct path to firebaseConfig

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logoUrl, setLogoUrl] = useState(null); // State to store the logo URL
  
  const scheme = useColorScheme(); // Detect dark mode
  const isDarkMode = scheme === 'dark'; // Check if it's dark mode

  useEffect(() => {
    // Fetch the logo from Firebase Storage
    const fetchLogo = async () => {
      try {
        const logoRef = ref(storage, 'logoText.png'); // Reference to the logo in Firebase Storage
        const url = await getDownloadURL(logoRef); // Fetch the download URL
        setLogoUrl(url); // Set the URL to state
      } catch (error) {
        console.error('Error fetching logo: ', error);
      }
    };

    fetchLogo();
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Successfully logged in
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeTab' }], // Use 'HomeTab' here to match the route name in BottomTabs
        });
      })
      .catch((error) => {
        // Error logging in
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      {/* Logo */}
      {logoUrl && (
        <Image source={{ uri: logoUrl }} style={styles.logo} /> // Dynamically load the logo from Firebase
      )}

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
        style={isDarkMode ? styles.darkInput : styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
        style={isDarkMode ? styles.darkInput : styles.input}
      />

      <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={isDarkMode ? styles.darkText : styles.text}>Don't have an account?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccountScreen')}>
        <Text style={isDarkMode ? styles.darkLinkText : styles.linkText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 350,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -50,
    marginBottom: 50,
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

  // Dark mode styles
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#121212',
  },
  darkInput: {
    height: 50,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#4CAF50',
    borderWidth: 1,
    color: '#FFFFFF',
  },
  darkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  darkText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  darkLinkText: {
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
