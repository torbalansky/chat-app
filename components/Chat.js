import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Button } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, orderBy, query, onSnapshot, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebaseConfig = {
  apiKey: "AIzaSyAkg3ziQFuxsUefkTP6jBJurUhJnB3uq2k",
  authDomain: "chat-app-f7f8d.firebaseapp.com",
  projectId: "chat-app-f7f8d",
  storageBucket: "chat-app-f7f8d.appspot.com",
  messagingSenderId: "511472899594",
  appId: "1:511472899594:web:b64845bacd69efb6f131f3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Sets up the chat screen component and handles real-time updates of messages
const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { userID, name, color } = route.params;
  const [messages, setMessages] = useState([]);
  
  let unsubMessages;

  useEffect(() => {
    // Update the navigation title with the user's name
    navigation.setOptions({ title: name });
  
    if (isConnected === true) {
    // Unsubscribe from previous snapshot listener (if exists)
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      
      // Create a Firestore query to get messages ordered by creation time
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
              })
            })
            cacheMessages(newMessages);
            setMessages(newMessages);
          })
        } else loadCachedMessages();

        return () => {
          if (unsubMessages) unsubMessages();
        }
      }, [isConnected]);
      
      // Load cached messages from AsyncStorage
      const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
      }

      // Cache messages to AsyncStorage
      const cacheMessages = async (messagesToCache) => {
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
          console.log(error.message);
        }
      }

      const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
      }

      // Render the input toolbar based on the internet connection status
      const renderInputToolbar = (props) => {
        if (isConnected === true) return <InputToolbar {...props} />;
        else return null;
      }

      const renderBubble = (props) => {
        return <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#000"
            },
            left: {
              backgroundColor: "#FFF"
            }
          }}
        />
      }

    // Render custom actions for the chat input toolbar
    const renderCustomActions = (props) => {
      return <CustomActions userID={userID} storage={storage} {...props} />;
    };
    
    // Render a custom view for displaying a map location
    const renderCustomView = (props) => {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3
            }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
    }
  
  const clearChat = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };  

   return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.clearButtonContainer}>
        <Button title="Clear Chat" onPress={clearChat} />
      </View>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        user= {{ _id: userID, name }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clearButtonContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default Chat;