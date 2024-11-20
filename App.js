import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Импортируйте главную страницу
import RequestForm from './screens/RequestForm'; // Импортируйте экран создания заявки
import RequestList from './screens/RequestList'; // Импортируйте экран списка заявок
import RequestDetail from './screens/RequestDetail'; // Импортируйте экран деталей заявки
import Dashboard from './screens/Dashboard';
import EditRequest from './screens/EditRequest';
import SignIn from './screens/SignIn';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="RequestForm" component={RequestForm} />
                <Stack.Screen name="RequestList" component={RequestList} />
                <Stack.Screen name="RequestDetail" component={RequestDetail} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="EditRequest" component={EditRequest} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;