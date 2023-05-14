import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';

const Chat = ({ route }) => {
  const { color } = route.params;
  const [message, setMessage] = useState('');

  const handleSend = () => {
    console.log(message);
    setMessage('');
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      {/* Chat messages view */}
      <View style={styles.chatView}>
        {/* Chat messages will be displayed here */}
      </View>

      {/* Input message and send button */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputField}
          placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatView: {
    flex: 1,
    width: '100%',
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ccc',
  },
  inputField: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  sendButton: {
    width: 80,
    height: 50,
    backgroundColor: '#4803b0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Chat;
