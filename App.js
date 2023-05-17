import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "./components/Start";
import Chat from "./components/Chat";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
import { useNetInfo }from '@react-native-community/netinfo';
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const Stack = createNativeStackNavigator(); // create a new stack-based navigation object

const App = () => {

    const connectionStatus = useNetInfo();
    useEffect(() => {
      if (connectionStatus.isConnected === false) {
        Alert.alert("Connection Lost!");
        disableNetwork(db);
      } else if (connectionStatus.isConnected === true) {
        enableNetwork(db);
      }
    }, [connectionStatus.isConnected]);

    const firebaseConfig = {
        apiKey: "AIzaSyAkg3ziQFuxsUefkTP6jBJurUhJnB3uq2k",
        authDomain: "chat-app-f7f8d.firebaseapp.com",
        projectId: "chat-app-f7f8d",
        storageBucket: "chat-app-f7f8d.appspot.com",
        messagingSenderId: "511472899594",
        appId: "1:511472899594:web:b64845bacd69efb6f131f3"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    // Initialize Firebase Storage handler
    const storage = getStorage(app);

            return (
                // Use NavigationContainer to navigate between different screens
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Start'>
                        <Stack.Screen
                            name='Start'
                            component={Start}
                        />
                        <Stack.Screen
                        name="Chat"
                        >
                        {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props} storage={storage} />}
                        </Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            );
        }

export default App;