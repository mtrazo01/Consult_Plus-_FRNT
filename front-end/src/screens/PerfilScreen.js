import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

const { width } = Dimensions.get("window");

const theme = {
  colors: {
    primaryDark: "#0B3D91",
    primary: "#1976D2",
    background: "#F8F9FB",
    card: "#FFFFFF",
    text: "#000000",
    border: "#DCE6F1",
    placeholder: "#7ba8cc",
    deleteGradientStart: "#ff6666",
    deleteGradientEnd: "#cc0000",
    backBtn: "#1976D2",
  },
  radius: {
    sm: 12,
    md: 14,
    lg: 26,
  },
};

// Máscaras
const formatarCPF = (value = "") => {
  if (!value) return "";
  const cpfNumeros = value.replace(/\D/g, "").slice(0, 11);
  return cpfNumeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatarTelefone = (value) => {
  const telefoneNumeros = value.replace(/\D/g, "");
  return telefoneNumeros
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

const limparNumeros = (valor) => valor.replace(/\D/g, "");

export default function PerfilScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Log dos parâmetros para debug
  console.log("PerfilScreen route.params:", route.params);

  const { usuario, setUsuario } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [nome, setNome] = useState(usuario?.nome || "");
  const cpfInicial = usuario?.cpf ? formatarCPF(usuario.cpf) : "";
  const [cpf, setCpf] = useState(cpfInicial);
  const [telefone, setTelefone] = useState(formatarTelefone(usuario?.telefone || ""));
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderBox}>
        <Text
          style={{
            fontFamily: "Montserrat_400Regular",
            color: theme.colors.primary,
            fontSize: 18,
          }}
        >
          Carregando...
        </Text>
      </View>
    );
  }

  const atualizarConta = async () => {
    try {
      console.log("Tentando atualizar conta com:", {
        nome,
        cpf: limparNumeros(cpf),
        senha,
        telefone: limparNumeros(telefone),
      });

      await api.put(`/usuarios/${usuario.id}`, {
        nome,
        cpf: limparNumeros(cpf),
        senha: senha || undefined, // Atualiza senha só se tiver valor
        telefone: limparNumeros(telefone),
      });

      // Atualiza o estado do usuário na HomeScreen (se setUsuario for função)
      if (typeof setUsuario === "function") {
        setUsuario({
          ...usuario,
          nome,
          cpf: limparNumeros(cpf),
          telefone: limparNumeros(telefone),
          senha: senha || usuario.senha,
        });
      } else {
        console.warn("setUsuario não é função, atualização local ignorada");
      }

      Alert.alert("✅ Sucesso", "Dados atualizados com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao atualizar conta:", err);
      Alert.alert(
        "❌ Erro",
        err.response?.data?.message || "Não foi possível atualizar os dados."
      );
    }
  };

  const confirmarExclusao = () => setModalVisible(true);

  const excluirConta = async () => {
    if (!confirmSenha) {
      Alert.alert("⚠️ Atenção", "Digite sua senha para confirmar.");
      return;
    }
    try {
      await api.delete(`/usuarios/${usuario.id}`, {
        data: { senha: confirmSenha },
      });
      Alert.alert("✅ Conta excluída", "Sua conta foi removida com sucesso.");
      setModalVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      if (err.response?.status === 401) {
        Alert.alert("❌ Senha incorreta", "Tente novamente.");
      } else {
        Alert.alert(
          "❌ Ah não!",
          "Você possui agendamentos. Cancele-os antes de excluir sua conta."
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primaryDark }}>
      {Platform.OS === "android" && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: theme.colors.primaryDark }} />
      )}
      <StatusBar backgroundColor={theme.colors.primaryDark} barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <View style={styles.logoBox}>
                <Image
                  source={require("../../assets/images/login-illustration.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Editar Perfil</Text>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Nome:</Text>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Digite seu nome"
                  placeholderTextColor={theme.colors.placeholder}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>CPF:</Text>
                <TextInput
                  style={styles.input}
                  value={cpf}
                  onChangeText={(text) => {
                    const somenteNumeros = text.replace(/\D/g, "").slice(0, 11);
                    setCpf(formatarCPF(somenteNumeros));
                  }}
                  placeholder="Digite seu CPF"
                  placeholderTextColor={theme.colors.placeholder}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Telefone:</Text>
                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={(text) => setTelefone(formatarTelefone(text))}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={theme.colors.placeholder}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Senha:</Text>
                <TextInput
                  style={styles.input}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  placeholderTextColor={theme.colors.placeholder}
                  secureTextEntry
                  autoComplete="password-new"
                />
              </View>

              <TouchableOpacity style={styles.updateButton} onPress={atualizarConta}>
                <LinearGradient colors={[theme.colors.primaryDark, theme.colors.primary]} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Atualizar Conta</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={confirmarExclusao}>
                <LinearGradient colors={[theme.colors.deleteGradientStart, theme.colors.deleteGradientEnd]} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Excluir Conta</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={20} color={theme.colors.backBtn} style={{ marginRight: 6 }} />
                <Text style={styles.backBtnText}>Voltar</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Confirme sua senha</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry
                value={confirmSenha}
                onChangeText={setConfirmSenha}
              />
              <View style={styles.modalBtns}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={excluirConta} style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  loaderBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: width * 0.92,
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 5,
    paddingHorizontal: 28,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoBox: { alignItems: "center", marginBottom: 18 },
  logoImage: { width: 110, height: 110 },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 26,
    color: theme.colors.primaryDark,
    textAlign: "center",
    marginBottom: 24,
  },
  inputBox: { marginBottom: 16 },
  label: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: theme.colors.primaryDark,
    marginBottom: 6,
  },
  input: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.card,
  },
  updateButton: { marginTop: 20, borderRadius: theme.radius.md, overflow: "hidden" },
  deleteButton: { marginTop: 12, borderRadius: theme.radius.md, overflow: "hidden" },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: theme.radius.md,
  },
  buttonText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    fontSize: 18,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    color: theme.colors.backBtn,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: theme.colors.primaryDark,
    marginBottom: 14,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
    marginRight: 10,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  cancelText: {
    color: theme.colors.primary,
    fontFamily: "Montserrat_600SemiBold",
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
  },
});
