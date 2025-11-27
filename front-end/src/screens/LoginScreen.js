import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskInput, { Masks } from "react-native-mask-input";
import api from "../services/api";

const { width } = Dimensions.get("window");

const theme = {
  colors: {
    primaryDark: "#0B3D91",
    primary: "#1976D2",
    card: "#FFFFFF",
    background: "#F7F7F7",
    text: "#000000",
    placeholder: "#757575",
    border: "#DCE6F1",
    personIcon: "#1976D2",
    lockIcon: "#F57C00",
  },
  fonts: {
    regular: "Montserrat_400Regular",
    semibold: "Montserrat_600SemiBold",
    bold: "Montserrat_700Bold",
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 28,
  },
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [fontsLoaded] = useFonts({
    [theme.fonts.bold]: Montserrat_700Bold,
    [theme.fonts.regular]: Montserrat_400Regular,
    [theme.fonts.semibold]: Montserrat_600SemiBold,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const login = async () => {
    if (!cpf || !senha) {
      Alert.alert("⚠️ Campos obrigatórios", "Preencha CPF e Senha.");
      return;
    }

    try {
      const response = await api.post("/usuarios/login", {
        cpf: cpf.replace(/\D/g, ""),
        senha,
      });

      const usuarioLogado = response.data.usuario;
      Alert.alert("✅ Login realizado com sucesso!");
      navigation.navigate("Home", { usuario: usuarioLogado });
    } catch (error) {
      Alert.alert("❌ Erro no login", "CPF ou senha incorretos.");
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text
          style={{
            fontFamily: theme.fonts.regular,
            color: theme.colors.text,
            fontSize: 18,
          }}
        >
          Carregando fontes...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Espaço para StatusBar no Android */}
      {Platform.OS === "android" && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: theme.colors.primaryDark }} />
      )}
      <StatusBar
        backgroundColor={theme.colors.primaryDark}
        barStyle="light-content"
        translucent={false}
      />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={30}
        >
          <Animated.View
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* LOGO */}
            <View style={styles.logoBox}>
              <Image
                source={require("../../assets/images/login-illustration.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Título */}
            <Text style={styles.title}>
              <Text style={{ color: theme.colors.primary }}>Consult</Text>
              <Text style={{ color: theme.colors.primaryDark }}>Plus</Text>
            </Text>
            <Text style={styles.subtitle}>Inovação que cuida.</Text>

            {/* Campo CPF */}
            <View style={styles.inputBox}>
              <Ionicons
                name="person-outline"
                size={22}
                color={theme.colors.personIcon}
                style={styles.icon}
              />
              <MaskInput
                value={cpf}
                onChangeText={setCpf}
                mask={Masks.BRL_CPF}
                placeholder="Digite seu CPF"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputBox}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={theme.colors.lockIcon}
                style={styles.icon}
              />
              <TextInput
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                style={styles.input}
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>

            {/* Botão */}
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={login}
              activeOpacity={0.9}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
              </View>
            </TouchableOpacity>

            {/* Link de cadastro */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Cadastro")}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos e-SUS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 40,
    paddingHorizontal: 26,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoBox: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 22,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 26,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: theme.radius.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  buttonWrapper: {
    borderRadius: theme.radius.md,
    overflow: "hidden",
    marginBottom: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: theme.radius.md,
  },
  buttonText: {
    fontFamily: theme.fonts.semibold,
    color: "#FFFFFF",
    fontSize: 18,
    letterSpacing: 1.1,
  },
  link: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.primaryDark,
    textAlign: "center",
    fontSize: 15,
    marginTop: 6,
  },
});
