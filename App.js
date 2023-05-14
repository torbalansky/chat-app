import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "./components/Start"
import Chat from "./components/Chat"

const Stack = createNativeStackNavigator(); // create a new stack-based navigation object

const App = () => {
    return (
        // Use NavigationContainer to navigate between different screens
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Start'>
                <Stack.Screen
                    name='Start'
                    component={Start}
                />
                <Stack.Screen
                    name='Chat'
                    component={Chat}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;