import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Button } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from "react-native-gifted-chat";
import { collection, orderBy, query, onSnapshot, addDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

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

const Chat = ({ route, navigation, db }) => {
  const { userID, name, color } = route.params;
  const [messages, setMessages] = useState([]);

  // Set the navigation title to the user's name
  useEffect(() => {
    navigation.setOptions({ title: name || 'Chat' });
  
    const unsubscribe = onSnapshot(
      query(collection(db, 'messages'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => {
          const messageData = doc.data();
          const createdAt = messageData.createdAt.toDate(); // Convert TimeStamp to Date object
          return {
            _id: doc.id,
            text: messageData.text,
            createdAt,
            user: messageData.user,
          };
        });
        setMessages(fetchedMessages);
      }
    );
  
    return () => unsubscribe();
    
  }, []);

  // Function to handle sending new messages
  const onSend = async (newMessages) => {
    const message = newMessages[0];
    if (!message || !message.text) {
      return; // Skip if the message or its text is undefined
    }
    message.user = { _id: userID, name: name || 'Unknown' }; // Provide a default name if name is undefined
    const newMessageRef = await addDoc(collection(db, 'messages'), message);
    if (newMessageRef.id) {
      setMessages([message, ...messages]);
    }
  };  
  
  // Custom render for chat bubbles
  const renderBubble = props => {
    return < Bubble {...props}
      wrapperStyle={{
        right: { backgroundColor: '#000' },
        left: { backgroundColor: '#FFF' }
      }}
    />
  }

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        textStyle={{
          color: 'grey', 
          fontWeight: 500,
          fontSize: 14,
        }}
      />
    );
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
        renderSystemMessage={renderSystemMessage}
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