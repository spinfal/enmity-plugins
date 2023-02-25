import { get, set } from "enmity/api/settings";
import { FormInput, Text, View } from "enmity/components";
import { React, Dialog, Users } from "enmity/metro/common";
import manifest from "../../manifest.json"
import styles from "./StyleSheet";

interface ShowAlertProps {
    title: string;
    userID: string;
    confirmText?: string;
    onConfirm: Function;
    existing?: string;
    placeholder?: string;
}

export const showAlert = ({ title, userID, confirmText = "Confirm", onConfirm, existing, placeholder }: ShowAlertProps) => {
    const User = Users.getUser(userID)

    // dialogs can take `children` or `body` but not both. 
    // `children` must take a component in jsx (<Component/>) and not an anonymous component(() => <Component/>)
    // `body` must take in a string which adheres to discord's formatting, so **bold**, __underlined__ will display correctly
    Dialog.show({
        title,
        children: <>
            <Text style={[
                styles.text, 
                styles.mainText,
                styles.buttonText,
                { paddingTop: 10, marginLeft: 0 }
            ]}>
                Reviewing: {User?.username}#{User?.discriminator}
            </Text>
            <View style={{
                paddingHorizontal: 0,
                paddingVertical: -5,
                marginTop: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "rgba(120, 120, 120, 0.3)",
            }}>
                <View style={{ marginBottom: -25 }} />
                <FormInput
                    placeholder={placeholder ?? ""}
                    value={existing ?? get(manifest.name, "inputValue", "")}
                    onChange={(value: string) => set(manifest.name, "inputValue", value)}
                    autoFocus={true}
                    showBorder={true}
                    multiline={true}
                    numberOfLines={2}
                />
            </View>
        </>,
        confirmText,
        cancelText: "Cancel",

        // calls onConfim with the current input value, and a callback that sets the value to whatever is defined later
        // so at call-time, you can use "(value, setValue) => {}" and use them accordingly
        onConfirm: () => onConfirm(
            get(manifest.name, "inputValue", ""), 
            (input: string) => set(manifest.name, "inputValue", input)
        )
    })
}

export default showAlert;