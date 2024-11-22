import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-paper';
import { doc, getDocs, getDoc, addDoc, collection, serverTimestamp, Timestamp, where, query } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';

export default function ManageAssets({ navigation }) {
    const [selectedTab, setSelectedTab] = useState('addYourOwn');
    const [assetName, setAssetName] = useState("");
    const [category, setCategory] = useState(null);
    const [value, setValue] = useState("");
    const [incomeSources, setIncomeSources] = useState([]);
    const { userProfile, setUserProfile, sendNotification } = useContext(UserContext);
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
    
          // Validate fields
          if (!assetName.trim() || !value || assetType === "None") {
            Alert.alert('Error', 'Please fill out all fields before submitting.');
            return;
          }
    
          const newAsset = {
            userId: user.uid,
            assetName: assetName,
            value: parseFloat(value.replace('$', '')),
            assetType: assetType,
            timestamp: serverTimestamp(),
          };
    
          // Add asset and immediately retrieve the document
          const docRef = await addDoc(collection(db, 'assets'), newAsset);
          const docSnapshot = await getDoc(docRef);
          const savedAsset = docSnapshot.data();
    
          if (savedAsset?.timestamp) {
            console.log('Asset added with timestamp:', savedAsset.timestamp.toDate());
            Alert.alert('Asset added successfully.');
          } else {
            console.warn('Timestamp not set on asset:', savedAsset);
          }
    
          // Send a notification to the user
          await sendNotification(
            user.uid,
            `Asset "${assetName}" was added successfully.`,
            'asset'
          );
    
          // Clear inputs
          setAssetName('');
          setValue('');
          setAssetType("None");
          navigation.goBack();
        } catch (error) {
          console.error('Error adding asset:', error);
          Alert.alert('Error', 'Failed to add asset. Please try again.');
        }
      };
    
      const handleChangeAssetType = async (incomeId, newAssetType) => {
        try {
          const user = auth.currentUser;
    
          if (!user) {
            console.error('User not logged in');
            return;
          }
    
          const income = incomeSources.find((inc) => inc.id === incomeId);
          if (income && newAssetType !== "None") {
            const assetRef = collection(db, 'assets');
            const assetQuery = query(assetRef, where('assetName', '==', income.name), where('userId', '==', user.uid));
            const assetSnapshot = await getDocs(assetQuery);
    
            // Check if the asset already exists
            if (!assetSnapshot.empty) {
              Alert.alert('Error', 'This income is already an asset.');
              return;
            }
    
            const newAsset = {
              userId: user.uid,
              assetName: income.name,
              value: income.incomePerMonth,
              assetType: newAssetType,
              timestamp: income.timestamp,
            };
    
            await addDoc(collection(db, 'assets'), newAsset);
            Alert.alert('Asset added successfully.');
    
            // Send a notification to the user
            await sendNotification(
              user.uid,
              `Income "${income.name}" was converted to an asset of type "${newAssetType}".`,
              'asset'
            );
          } else {
            Alert.alert('Error', 'Please select a valid asset type.');
          }
        } catch (error) {
          console.error('Error changing asset type:', error);
          Alert.alert('Error', 'Failed to change asset type. Please try again.');
        }
      };

    const formatNumberWithCommas = (value) => {
        if (!value) return '';
        return parseFloat(value.replace(/,/g, '')).toLocaleString('en-US');
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
                    value={value ? `$${formatNumberWithCommas(value)}` : ''} // Show dollar sign with formatted value
                    onChangeText={(text) => {
                    // Remove dollar sign and non-numeric characters except for decimal points
                    const numericValue = text.replace(/[^0-9.]/g, '');
                    setValue(numericValue);
                    }}
                    keyboardType="numeric"
                    style={isDarkMode ? styles.darkInput : styles.input}
                    placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
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
                            Income Per Month: ${formatNumberWithCommas(income.incomePerMonth.toFixed(2))}
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
                            style={{
                            inputAndroid: {
                                ...isDarkMode ? styles.darkText : styles.text,
                                color: isDarkMode ? '#FFFFFF' : '#333',
                            },
                            inputIOS: {
                                ...isDarkMode ? styles.darkText : styles.text,
                                color: isDarkMode ? '#FFFFFF' : '#333',
                            },
                            }}
                        />
                        <TouchableOpacity 
                            onPress={() => handleChangeAssetType(income.id, assetType)}
                            style = {{ alignSelf: 'flex-end' }}
                        >
                            <Text style={isDarkMode ? styles.darkChangeText : styles.changeText}>Modify Asset Type</Text>
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
    changeText: {
        alignSelf: 'flex-end', // Align to the right side of the card
        color: '#00796B',
        fontWeight: 'bold',
        bottom: 5,
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
    darkChangeText: {
        alignSelf: 'flex-end', // Align to the right side of the card
        color: '#4CAF50',
        fontWeight: 'bold',
        bottom: 5,
    },
});