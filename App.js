import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Импортируйте главную страницу
import RequestForm from './screens/RequestForm'; // Импортируйте экран создания заявки
import RequestList from './screens/RequestList'; // Импортируйте экран списка заявок

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="RequestForm" component={RequestForm} />
                <Stack.Screen name="RequestList" component={RequestList} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;