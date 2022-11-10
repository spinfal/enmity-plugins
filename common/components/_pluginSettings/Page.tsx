// main imports of elements and dependencies
import { React, Navigation, NavigationNative, NavigationStack, StyleSheet, ColorMap } from "enmity/metro/common";
import { Button, View } from "enmity/components";

// main settings stack
export const Settings = NavigationStack.createStackNavigator();

const { ThemeColorMap } = ColorMap;
export default ({
  name = "Page",
  component = View,
  close_button = {
    name: "Close",
    functionality: (): void => {
      Navigation.pop()
    }
  },
} = {}) => {
  const styles = StyleSheet.createThemedStyleSheet({
    container: {
      backgroundColor: ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      flex: 1,
    },
    cardStyle: {
      backgroundColor: ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
      color: ThemeColorMap.TEXT_NORMAL
    },
    header: {
      backgroundColor: ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      shadowColor: "transparent",
      elevation: 0,
    },
    headerTitleContainer: {
      color: ThemeColorMap.HEADER_PRIMARY,
    },
    close: {
      color: ThemeColorMap.HEADER_PRIMARY
    }
  });

  return <NavigationNative.NavigationContainer>
    <Settings.Navigator
      initialRouteName={name}
      style={styles.container}
      screenOptions={{
        cardOverlayEnabled: !1,
        cardShadowEnabled: !1,
        cardStyle: styles.cardStyle,
        headerStyle: styles.header,
        headerTitleContainerStyle: styles.headerTitleContainer,
        headerTitleAlign: "center",
        safeAreaInsets: {
          top: 0,
        },
      }}
    >
      <Settings.Screen
        name={name}
        component={component}
        options={{
          headerTitleStyle: {
            color: "white",
          },
          headerLeft: () => (<Button
            color={styles.close.color}
            title={close_button.name}
            onPress={close_button.functionality}
          />),
          ...NavigationStack.TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
    </Settings.Navigator>
  </NavigationNative.NavigationContainer>;
}