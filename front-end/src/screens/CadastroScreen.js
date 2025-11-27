import { useFonts } from "@expo-google-fonts/montserrat";
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
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputPadronizado from "../components/InputPadronizado";
import { Colors, Radius, Spacing, Typography } from "../design/theme";
import api from "../services/api";

const { width, height } = Dimensions.get("window");

export default function CadastroScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular: Typography.regular,
    Montserrat_600SemiBold: Typography.semiBold,
    Montserrat_700Bold: Typography.bold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  // -----------------------
  // 🔍 VALIDAÇÃO REAL DE CPF
  // -----------------------
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  }

  // -----------------------
  // 📲 CADASTRAR
  // -----------------------
  const cadastrar = async () => {
    if (!nome || !cpf || !senha || !telefone || !dataNascimento) {
      return Alert.alert("⚠️ Atenção", "Preencha todos os campos");
    }

    if (!validarCPF(cpf)) {
      return Alert.alert("❌ CPF inválido", "Digite um CPF válido.");
    }

    try {
      await api.post("/usuarios", {
        nome,
        cpf: cpf.replace(/\D/g, ""),
        senha,
        telefone: telefone.replace(/\D/g, ""),
        data_nascimento: dataNascimento.split("/").reverse().join("-"),
      });

      Alert.alert("🎉 Sucesso!", "Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Erro", "Falha ao cadastrar usuário. Verifique os dados.");
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.bg, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontFamily: Typography.regular, color: Colors.primary, fontSize: 20 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {Platform.OS === "android" && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: Colors.background }} />
      )}

      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.bg}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll}
          enableOnAndroid
          enableAutomaticScroll
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.logoBox}>
              <Image
                source={require("../../assets/images/login-illustration.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Preencha seus dados para criar a conta</Text>

            {/* NOME */}
            <View style={styles.inputBox}>
              <InputPadronizado
                value={nome}
                onChangeText={setNome}
                placeholder="Nome completo"
                autoCapitalize="words"
              />
            </View>

            {/* CPF */}
            <View style={styles.inputBox}>
              <InputPadronizado
                value={cpf}
                onChangeText={setCpf}
                placeholder="CPF"
                mask="cpf"
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            {/* TELEFONE */}
            <View style={styles.inputBox}>
              <InputPadronizado
                value={telefone}
                onChangeText={setTelefone}
                placeholder="Celular"
                mask="telefone"
                keyboardType="phone-pad"
              />
            </View>

            {/* DATA DE NASCIMENTO */}
            <View style={styles.inputBox}>
              <InputPadronizado
                value={dataNascimento}
                onChangeText={setDataNascimento}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                mask="data"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* SENHA */}
            <View style={styles.inputBox}>
              <InputPadronizado
                value={senha}
                onChangeText={setSenha}
                placeholder="Senha"
                secureTextEntry
              />
            </View>

            {/* BOTÃO */}
            <TouchableOpacity style={styles.button} onPress={cadastrar} activeOpacity={0.9}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            {/* VOLTAR */}
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.primary} />
              <Text style={styles.backBtnText}>Voltar ao Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background, justifyContent: "center" },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", minHeight: height },
  card: {
    width: width * 0.92,
    maxWidth: 390,
    backgroundColor: Colors.cardBackground,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: "stretch",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginVertical: Spacing.lg,
  },
  logoBox: { alignItems: "center", justifyContent: "center", marginBottom: Spacing.sm },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: Radius.sm,
    backgroundColor: Colors.cardBackground,
  },
  title: {
    fontFamily: Typography.bold,
    fontSize: 27,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 7,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: Typography.regular,
    color: Colors.textPrimary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  inputBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Typography.semiBold,
    color: "#fff",
    fontSize: 17.5,
    letterSpacing: 1,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: Radius.sm,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnText: {
    fontFamily: Typography.semiBold,
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 5,
  },
});
