import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Импортируйте главную страницу
import RequestForm from './screens/RequestForm'; // Импортируйте экран создания заявки
import RequestList from './screens/RequestList'; // Импортируйте экран списка заявок
import RequestDetail from './screens/RequestDetail'; // Импортируйте экран деталей заявки
import Dashboard from './screens/Dashboard'; 

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="RequestForm" component={RequestForm} />
                <Stack.Screen name="RequestList" component={RequestList} />
                <Stack.Screen name="RequestDetail" component={RequestDetail} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;