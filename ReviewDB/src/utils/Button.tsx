import { Text, TouchableOpacity, View } from "enmity/components";
import { React } from "enmity/metro/common";
import styles from "./StyleSheet";

interface ButtonProps {
  text: string;
  onPress?: Function
}

export default function Button({ text, onPress }: ButtonProps) {
  return <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={styles.button}
      onPress={onPress ?? console.log("No press function provided.")}>
      <Text style={[styles.text, styles.buttonText]}>{text}</Text>
    </TouchableOpacity>
  </View>
}
