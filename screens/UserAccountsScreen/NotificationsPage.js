import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, Alert } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler';
import { db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';

export default function NotificationsPage() {
  const { userProfile } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  useEffect(() => {
    if (!userProfile.id) return;

    const notificationsRef = collection(db, 'users', userProfile.id, 'notifications');
    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    });

    return () => unsubscribe();
  }, [userProfile.id]);

  useEffect(() => {
    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, [notifications]);

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => n.status === 'unread');
      if (unreadNotifications.length === 0) return;

      const batch = writeBatch(db);
      unreadNotifications.forEach((n) => {
        const notificationRef = doc(db, 'users', userProfile.id, 'notifications', n.id);
        batch.update(notificationRef, { status: 'read' });
      });

      await batch.commit();
      //console.log('All visible notifications marked as read.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const notificationRef = doc(db, 'users', userProfile.id, 'notifications', id);
      await deleteDoc(notificationRef);
      //Alert.alert('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={isDarkMode ? styles.darkDeleteButton : styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </View>
      )}
      onSwipeableOpen={() => handleDeleteNotification(item.id)}
    >
      <View style={isDarkMode ? styles.darkNotificationItem : styles.notificationItem}>
        <Text style={isDarkMode ? styles.darkNotificationText : styles.notificationText}>{item.message}</Text>
        <Text style={isDarkMode ? styles.darkNotificationDate : styles.notificationDate}>
          {new Date(item.timestamp?.seconds * 1000).toLocaleString()}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      <Text style={isDarkMode ? styles.darkHeader : styles.header}>Notifications</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={isDarkMode ? styles.darkNoNotifications : styles.noNotifications}>
          No notifications
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  noNotifications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    backgroundColor: 'red',
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // Dark mode styles
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  darkHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  darkNotificationItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  darkNotificationText: {
    fontSize: 16,
    color: '#fff',
  },
  darkNotificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  darkNoNotifications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  darkDeleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    backgroundColor: 'darkred',
    borderRadius: 10,
    marginBottom: 10,
  },
});