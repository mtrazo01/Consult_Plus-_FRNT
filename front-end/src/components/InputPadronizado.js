import { StyleSheet, TextInput } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Colors, Typography } from "../design/theme";

export default function InputPadronizado({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  mask = null,
  keyboardType = "default",
}) {
  if (mask) {
    let maskPattern;
    if (mask === "cpf") maskPattern = Masks.BRL_CPF;
    else if (mask === "telefone") maskPattern = Masks.BRL_PHONE;
    else if (mask === "data") maskPattern = Masks.DATE_DDMMYYYY;

    return (
      <MaskInput
        value={value}
        onChangeText={onChangeText}
        mask={maskPattern}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.input}
        placeholderTextColor={Colors.textSecondary}
      />
    );
  }

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={styles.input}
      placeholderTextColor={Colors.textSecondary}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontFamily: Typography.regular,
    fontSize: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
  },
});
