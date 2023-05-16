import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Button } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, InputToolbar } from "react-native-gifted-chat";
import { collection, orderBy, query, onSnapshot, addDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const Chat = ({ route, navigation, db, isConnected }) => {
  const { userID, name, color } = route.params;
  const [messages, setMessages] = useState([]);
  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name || 'Chat' });
  
        if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("chat_messages");
      if (cachedMessages !== null) {
        const parsedMessages = JSON.parse(cachedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.log("Error loading cached messages:", error);
    }
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("chat_messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log("Error caching messages:", error);
    }
  };

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

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
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
        renderInputToolbar={renderInputToolbar}
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