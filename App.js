import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "./components/Start";
import Chat, { getFirestore } from "./components/Chat";
import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const Stack = createNativeStackNavigator(); // create a new stack-based navigation object

const firebaseConfig = {
    apiKey: "AIzaSyDBTKiTBOtz4d8X3mM35wkn20usj2no9Bk",
    authDomain: "chat-app-c35b4.firebaseapp.com",
    projectId: "chat-app-c35b4",
    storageBucket: "chat-app-c35b4.appspot.com",
    messagingSenderId: "1064285691971",
    appId: "1:1064285691971:web:0883b8dd1dfdf07e04b4f6",
    measurementId: "G-5Y88MYQDMJ"
  };

export default class App extends React.Component {
    constructor(props) {
        super(props);
        initializeApp(firebaseConfig);
      }

    render() {
        return (
            // Use NavigationContainer to navigate between different screens
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Start'>
                    <Stack.Screen
                        name='Start'
                        component={Start}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='Chat'
                        component={() => <Chat db={firestore()} />}
                        options={({ route }) => ({ title: route.params.name })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}