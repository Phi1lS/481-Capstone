import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-paper';
import { doc, getDocs, getDoc, addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';

export default function ManageAssets() {
    const [selectedTab, setSelectedTab] = useState('addYourOwn');
    const [assetName, setAssetName] = useState("");
    const [category, setCategory] = useState(null);
    const [value, setValue] = useState("");
    const [incomeSources, setIncomeSources] = useState([]);
    const { userProfile, setUserProfile } = useContext(UserContext); 
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const [assetType, setAssetType] = useState("None");

    useEffect(() => {
        const fetchIncomeSources = async () => {
            const user = auth.currentUser;
            if (user) {
                const incomeRef = collection(db, 'incomes');
                const querySnapshot = await getDocs(incomeRef);
                const incomes = querySnapshot.docs
                    .filter(doc => doc.data().userId === user.uid)
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                incomes.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
                setIncomeSources(incomes);
            }
        };

        fetchIncomeSources();
    }, []);

    const translateCategory = (category) => {
        switch (category) {
            case 'investment':
                return 'Investment';
            case 'realEstate':
                return 'Real Estate';
            case 'retirement':
                return 'Retirement';
            case 'stock':
                return 'Stock';
            case 'bond':
                return 'Bond';
            case 'cash':
                return 'Cash';
            default:
                return 'Unknown';
        }
    };

    const handleAddAsset = async () => {
        try {
            const user = auth.currentUser;
    
            if (!user) {
                console.error('User not logged in');
                return;
            }
    
            // Log current state values for debugging
            console.log('Asset Name:', assetName);
            console.log('Value:', value);
            console.log('Asset Type:', assetType);
    
            // Validate fields
            if (!assetName.trim() || !value || assetType === "None") {
                Alert.alert('Error', 'Please fill out all fields before submitting.');
                return;
            }
    
            const newAsset = {
                userId: user.uid,
                assetName: assetName,
                value: parseFloat(value.replace('$', '')), // Remove dollar sign before submitting
                assetType: assetType,
                timestamp: serverTimestamp(),
            };
    
            await addDoc(collection(db, 'assets'), newAsset);
            console.log('Asset added to Firestore');
    
            // Clear inputs
            setAssetName('');
            setValue('');
            setAssetType("None");
        } catch (error) {
            console.error('Error adding asset:', error);
        }
    };

    const handleChangeAssetType = async (incomeId, newAssetType) => {
        const income = incomeSources.find((inc) => inc.id === incomeId);
        if (income && newAssetType !== "None") {
            const newAsset = {
                userId: auth.currentUser.uid,
                assetName: income.name,
                value: income.incomePerMonth,
                assetType: newAssetType,
                timestamp: income.timestamp,
            };
    
            await addDoc(collection(db, 'assets'), newAsset);
            console.log('Asset duplicated successfully');
        } else {
            Alert.alert('Error', 'Please select a valid asset type.');
        }
    };

    return (
        <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
            <Text style={isDarkMode ? styles.darkHeader : styles.header}>Manage Assets</Text>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'addYourOwn' && (isDarkMode ? styles.darkActiveTab : styles.activeTab),
                        styles.curvedTab,
                    ]}
                    onPress={() => setSelectedTab('addYourOwn')}
                >
                    <Text
                        style={
                            selectedTab === 'addYourOwn'
                                ? isDarkMode
                                    ? styles.darkActiveTabText
                                    : styles.activeTabText
                                : isDarkMode
                                ? styles.darkTabText
                                : styles.tabText
                        }
                    >
                        Add Your Own
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'addFromIncome' && (isDarkMode ? styles.darkActiveTab : styles.activeTab),
                        styles.curvedTab,
                    ]}
                    onPress={() => setSelectedTab('addFromIncome')}
                >
                    <Text
                        style={
                            selectedTab === 'addFromIncome'
                                ? isDarkMode
                                    ? styles.darkActiveTabText
                                    : styles.activeTabText
                                : isDarkMode
                                ? styles.darkTabText
                                : styles.tabText
                        }
                    >
                        Add From Income
                    </Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'addYourOwn' ? (
                <View style={isDarkMode ? styles.darkContainer : styles.container}>
                    <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
                        <TextInput
                            placeholder="Asset Name"
                            value={assetName}
                            onChangeText={setAssetName}
                            style={isDarkMode ? styles.darkInput : styles.input}
                            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                            selectionColor={isDarkMode ? '#4CAF50' : '#00796B'} // Green caret
                        />
                </View>

                <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
                    <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        placeholder={{ label: "Asset Type", value: null }}
                        onValueChange={setAssetType}
                        Icon={() => <Icon source="menu-down" style={styles.icon} size={24} />}
                        style={{
                            inputAndroid: {
                                ...isDarkMode ? styles.darkInput : styles.input,
                                color: isDarkMode ? '#FFFFFF' : '#333',
                            },
                            inputIOS: {
                                ...isDarkMode ? styles.darkInput : styles.input,
                                color: isDarkMode ? '#FFFFFF' : '#333',
                            },
                        }}
                        items={[
                            { label: "None", value: "None" },
                            { label: "Stock", value: "stock" },
                            { label: "Bond", value: "bond" },
                            { label: "Real Estate", value: "realEstate" },
                            { label: "Cash", value: "cash" },
                        ]}
                    />
                </View>

                <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
                    <TextInput
                        placeholder="Value"
                        value={value.length > 0 ? `$${value}` : value} // Show dollar sign
                        onChangeText={(text) => setValue(text.replace('$', ''))} // Remove dollar sign for submission
                        keyboardType="numeric"
                        style={isDarkMode ? styles.darkInput : styles.input}
                        selectionColor={isDarkMode ? '#4CAF50' : '#00796B'} // Green caret
                    />
                </View>
                    <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={handleAddAsset}>
                        <Text style={styles.buttonText}>Add Asset</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={isDarkMode ? styles.darkContainer : styles.container}>
                     {incomeSources.map((income) => (
                        <Card key={income.id} style={isDarkMode ? styles.darkCard : styles.card}>
                            <Card.Title
                                title={income.name}
                                left={(props) => <Avatar.Icon {...props} icon="cash" style={styles.icon} />}
                                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                            />
                            <View style={styles.sliderContainer}>
                                <Text style={isDarkMode ? styles.darkText : styles.text}>
                                    Category: {translateCategory(income.category)}
                                </Text>
                                <Text style={isDarkMode ? styles.darkText : styles.text}>
                                    Income Per Month: ${income.incomePerMonth.toFixed(2)}
                                </Text>
                            </View>

                            {/* Dropdown for Asset Type Selection */}
                            <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{ label: "Select Asset Type", value: null }}
                                onValueChange={(value) => setAssetType(value)} // Set the selected asset type
                                items={[
                                    { label: "None", value: "None" },
                                    { label: "Stock", value: "stock" },
                                    { label: "Bond", value: "bond" },
                                    { label: "Real Estate", value: "realEstate" },
                                    { label: "Cash", value: "cash" },
                                ]}
                            />

                            <TouchableOpacity onPress={() => handleChangeAssetType(income.id, assetType)}>
                                <Text style={isDarkMode ? styles.changeText : styles.text}>Change Asset Type</Text>
                            </TouchableOpacity>
                        </Card>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Light mode styles
    safeArea: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'left',
      padding: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#E0E0E0',
    },
    activeTab: {
      backgroundColor: '#00796B',
    },
    curvedTab: {
      borderRadius: 20,
      marginHorizontal: 10,
      paddingHorizontal: 15,
    },
    tabText: {
      fontSize: 16,
      color: '#555',
    },
    activeTabText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    container: {
      padding: 20,
    },
    inputCard: {
      marginBottom: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 15,
      elevation: 10,
      padding: 10,
    },
    icon: {
        backgroundColor: '#E8F5E9',
      },
    input: {
      height: 50,
      paddingHorizontal: 15,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#00796B',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '600',
    },
    card: {
        marginBottom: 25,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 15,
        elevation: 10,
        padding: 15,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
    placeholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 16,
      color: '#555',
    },
    // Dark mode styles
    darkSafeArea: {
      flex: 1,
      backgroundColor: '#121212',
    },
    darkHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'left',
      padding: 20,
    },
    darkContainer: {
      padding: 20,
    },
    darkTab: {
      backgroundColor: '#333333',
    },
    darkActiveTab: {
      backgroundColor: '#4CAF50',
    },
    darkTabText: {
      fontSize: 16,
      color: '#AAAAAA',
    },
    darkActiveTabText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    darkCard: {
        marginBottom: 25,
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 15,
        elevation: 10,
        padding: 15,
    },
    darkCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    darkInputCard: {
      marginBottom: 20,
      backgroundColor: '#1E1E1E',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 15,
      elevation: 10,
      padding: 10,
    },
    darkInput: {
      height: 50,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#FFFFFF',
    },
    darkButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    darkPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    darkText: {
      fontSize: 16,
      color: '#AAAAAA',
    },
});