import { StyleSheet, ImageBackground, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const Start = ({ navigation }) => {
  // State variables for name and color
  const [name, setName] = useState('');
  const [color, setColor] = useState('#090C08');
  const [selected, setSelected] = useState(null);

  // Color circle style with conditional border
  const getColorStyle = (color) => {
    return {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderColor: color === selected ? 'black' : 'transparent',
      borderWidth: color === selected ? 3 : 0
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../background.png')} style={styles.image}>
        <Text style={styles.title}>Chat App</Text>
        <View style={styles.innerContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your name'
          />
          <Text style={styles.colorText}>Choose Background Color</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity 
              style={[getColorStyle('#C7EFCF'), { backgroundColor: '#C7EFCF' }]}
              onPress={() => {
                setColor('#C7EFCF')
                setSelected('#C7EFCF')
              }}
            />
            <TouchableOpacity 
              style={[getColorStyle('#F3E9E3'), { backgroundColor: '#F3E9E3' }]}
              onPress={() => {
                setColor('#F3E9E3')
                setSelected('#F3E9E3')
              }}
            />
            <TouchableOpacity 
              style={[getColorStyle('#F5C5D9'), { backgroundColor: '#F5C5D9' }]}
              onPress={() => {
                setColor('#F5C5D9')
                setSelected('#F5C5D9')
              }}
            />
            <TouchableOpacity 
              style={[getColorStyle('#D1DCE5'), { backgroundColor: '#D1DCE5' }]}
              onPress={() => {
                setColor('#D1DCE5')
                setSelected('#D1DCE5')
              }}
            />
          </View>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Chat', { name, color })}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#aaa',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerContainer: {
      width: '88%',
      height: '44%',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      marginBottom: 300,
      overflow: 'scroll',
     
    },
    textInput: {
      width: '88%',
      padding: 15,
      borderWidth: 1,
      marginTop: 30,
      marginBottom: 10,
      fontSize: 18,
      fontWeight: '400',
      color: '#757083'
    },
    image: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      resizeMode: 'cover'
    },
    colorContainer: {
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 10
    },
    button: {
      width: '88%',
      height: 60,
      backgroundColor: '#6C5B7B',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 25,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 1,
    },
    color: {
      width: 60,
      height: 60,
      borderRadius: 30
      },
    colorText: {
      fontSize: 16,
      fontWeight: '300',
      color: '#757083'
      },
    title: {
      fontSize: 50,
      fontWeight: 600,
      color: '#FFFFFF',
      marginTop: '5%',
      fontFamily: 'Roboto',
      }
    });
    
export default Start;