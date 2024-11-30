import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AuthProvider from './services/AuthContext';
import HomeScreen from './screens/HomeScreen';
import RequestForm from './screens/RequestForm';
import RequestList from './screens/RequestList';
import RequestDetail from './screens/RequestDetail';
import Dashboard from './screens/Dashboard';
import EditRequest from './screens/EditRequest';
import SelectEquipment from './screens/SelectEquipment';
import RouteSheet from './screens/RouteSheet';
import SignIn from './screens/SignIn';
import Profile from './screens/Profile';
import OrderEquipment from './screens/OrderEquipment';
import Waybills from './screens/Waybills';
import EditWaybill from './screens/EditWaybill';
import Analitik from './screens/Analitik';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RequestStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Главная' }} />
            <Stack.Screen name="RequestForm" component={RequestForm} options={{ title: 'Создание сводной заявки' }} />
            <Stack.Screen name="RequestList" component={RequestList} options={{ title: 'Список заявок' }} />
            <Stack.Screen name="RequestDetail" component={RequestDetail} options={{ title: 'Добавление техники' }} />
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Моя Диспетчерская' }} />
            <Stack.Screen name="EditRequest" component={EditRequest} options={{ title: 'Редактирование заявки' }} />
            <Stack.Screen name="SelectEquipment" component={SelectEquipment} options={{ title: 'Выбор а/м' }} />
            <Stack.Screen name="OrderEquipment" component={OrderEquipment} options={{ title: 'Заказ а/м у контрагента' }} />
            <Stack.Screen name="RouteSheet" component={RouteSheet} options={{ title: 'Путевой лист' }} />
            <Stack.Screen name="Waybills" component={Waybills} options={{ title: 'Список путевых листов' }} />
            <Stack.Screen name="EditWaybill" component={EditWaybill} options={{ title: 'Изменение путевого листа' }} />
            <Stack.Screen name="Analitik" component={Analitik} options={{ title: 'Аналитика' }} />
        </Stack.Navigator>
    );
};

const ProfilePage = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile} options={{ title: 'Профиль'}} />
        </Stack.Navigator>
    )
}

const MainTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Главная"
                component={RequestStack} 
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Профиль"
                component={ProfilePage}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

// Главный компонент приложения
const App = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <HomeStack />
            </NavigationContainer>
        </AuthProvider>
    );
};

export default App;