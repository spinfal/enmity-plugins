import { React, Navigation, NavigationNative, NavigationStack, StyleSheet, Constants } from 'enmity/metro/common';
import { TouchableOpacity, Text, View } from 'enmity/components';
import styles from './StyleSheet';

const PageNavigator = NavigationStack.createStackNavigator();
export default ({ component = View } = {}) => {
  return <NavigationNative.NavigationContainer independent>
    <PageNavigator.Navigator
      initialRouteName={"ReviewDB"}
      style={styles.authContainer}
      screenOptions={{
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
        cardStyle: styles.authCard,
        headerStyle: styles.authHeader,
        headerTitleContainerStyle: { color: Constants.ThemeColorMap.HEADER_PRIMARY },
        headerTitleAlign: 'center',
        safeAreaInsets: {
          top: 0,
        },
      }}
    >
       <PageNavigator.Screen
            name={""}
            component={() => { 
                const Component = component;
                return <>
                    <View style={{ marginTop: -45 }} />
                    <Component />
                </>
            }}
            options={{
                headerLeft: () => (
                <TouchableOpacity 
                    onPress={(): void => {
                        Navigation.pop()
                    }}
                >
                    <Text style={styles.authText}>{"Close"}</Text>
                </TouchableOpacity>),
            }}
      />
    </PageNavigator.Navigator>
  </NavigationNative.NavigationContainer>;
};