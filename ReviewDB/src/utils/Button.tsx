import { getIDByName } from 'enmity/api/assets';
import { FormRow, Text, TouchableOpacity, View } from "enmity/components";
import { React } from "enmity/metro/common";
import styles from "./StyleSheet";

interface ButtonProps {
  text: string;
  image?: string;
  dangerous?: boolean;
  onPress?: Function;
  style?: { [key: string]: any }
}

export default function Button({ text, image = "ic_new_group", dangerous, onPress, style }: ButtonProps) {
  return <View style={[styles.buttonContainer, style]}>
    <TouchableOpacity
      style={styles.button}
      onPress={onPress ?? console.log("No press function provided.")}
    >
      {/* @ts-ignore ~ cannot assign actual props to intrinsic attributes, i can confirm this works */}
      <FormRow.Icon source={getIDByName(image)} style={[
        styles.icon, 
        dangerous 
          ? styles.dangerousIcon
          : styles.safeIcon
      ]} />
      <Text style={[
        styles.text, 
        dangerous 
          ? styles.dangerousText 
          : styles.safeText, 
        styles.buttonText
      ]}>{text}</Text>
    </TouchableOpacity>
  </View>
}
