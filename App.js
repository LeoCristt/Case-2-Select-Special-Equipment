import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; 
import RequestForm from './screens/RequestForm'; 
import RequestList from './screens/RequestList'; 
import RequestDetail from './screens/RequestDetail'; 
import Dashboard from './screens/Dashboard';
import EditRequest from './screens/EditRequest';
import SelectEquipment from './screens/SelectEquipment';
import RouteSheet from './screens/RouteSheet';
import SignIn from './screens/SignIn';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }}/>
                <Stack.Screen name="RequestForm" component={RequestForm} options={{ title: 'Создание сводной заявки' }}/>
                <Stack.Screen name="RequestList" component={RequestList} options={{ title: 'Список заявок' }}/>
                <Stack.Screen name="RequestDetail" component={RequestDetail} options={{ title: 'Добавление техники' }}/>
                <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Моя Диспетчерская' }}/>
                <Stack.Screen name="EditRequest" component={EditRequest} options={{ title: 'Редактирование заявки' }}/>
                <Stack.Screen name="SelectEquipment" component={SelectEquipment} options={{ title: 'Выбор а/м' }}/>
                <Stack.Screen name="RouteSheet" component={RouteSheet} options={{ title: 'Путевой лист' }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;