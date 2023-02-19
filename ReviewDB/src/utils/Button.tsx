import { Text, TouchableOpacity, View } from "enmity/components";
import { React } from "enmity/metro/common";
import styles from "./StyleSheet";

export default function Button({ text, press }: { text: string, press?: any }) {
  return <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        {press || console.log("No press function provided.")}
      }}>
      <Text style={[styles.text, styles.buttonText]}>{text}</Text>
    </TouchableOpacity>
  </View>
}
