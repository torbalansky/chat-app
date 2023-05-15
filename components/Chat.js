import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from "react-native-gifted-chat";
import { collection, orderBy, query, onSnapshot, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBTKiTBOtz4d8X3mM35wkn20usj2no9Bk",
  authDomain: "chat-app-c35b4.firebaseapp.com",
  projectId: "chat-app-c35b4",
  storageBucket: "chat-app-c35b4.appspot.com",
  messagingSenderId: "1064285691971",
  appId: "1:1064285691971:web:0883b8dd1dfdf07e04b4f6",
  measurementId: "G-5Y88MYQDMJ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params;
  const [messages, setMessages] = useState([]);

   // Set the navigation title to the user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  
    const unsubscribe = onSnapshot(query(collection(firestore, 'messages'), orderBy('createdAt', 'desc')), (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => {
        const messageData = doc.data();
        return {
          _id: doc.id,
          text: messageData.text,
          createdAt: messageData.createdAt.toDate(), // Convert Firestore Timestamp to Date object
          user: {
            _id: messageData.user._id,
            name: messageData.user.name,
            avatar: messageData.user.avatar,
          },
        };
      });
      setMessages(fetchedMessages);
    });
  
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Function to handle sending new messages
  const onSend = (newMessages) => {
    addDoc(collection(firestore, 'messages'), newMessages[0]);
  }

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

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        onSend={messages => onSend(messages)}
        user= {{
          _id: route.params.id, // Use the user ID from route.params
          name: route.params.name, // Use the name from route.params
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;