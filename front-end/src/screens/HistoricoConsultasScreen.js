import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

const { width, height } = Dimensions.get("window");

const theme = {
  colors: {
    primaryDark: "#0B3D91",
    primary: "#1976D2",
    background: "#F7F7F7",
    card: "#FFFFFF",
    text: "#000000",
    border: "#DCE6F1",
    infoIcon: "#1976D2",
    timeIcon: "#F57C00",
    delete: "#D32F2F",
    backBtn: "#1976D2",
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
  },
};

export default function HistoricoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { usuario } = route.params || {};
  const usuarioId = usuario?.id ?? usuario?.userId ?? usuario?.usuario_id ?? null;

  if (!usuarioId) {
    console.warn("⚠️ ERRO: usuarioId não encontrado");
  }

  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false);
      return;
    }

    const fetchConsultas = async () => {
      try {
        const response = await api.get(`/consultas/usuario/${usuarioId}`);
        setConsultas(response.data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, [usuarioId]);

  // Separar animação em outro useEffect para rodar só uma vez
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item }) => {
    try {
      const dataLocal = new Date(item.data_hora);

      return (
        <Animated.View style={[styles.cardConsulta, { opacity: fadeAnim }]}>
          <Text style={styles.medico}>
            <Ionicons name="person-circle-outline" size={20} color={theme.colors.infoIcon} /> {item.medico}
          </Text>
          <Text style={styles.especialidade}>
            <Ionicons name="medkit-outline" size={18} color={theme.colors.primary} /> {item.especialidade}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.dateText}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.infoIcon} />{" "}
              {dataLocal.toLocaleDateString("pt-BR")}
            </Text>
            <Text style={styles.timeText}>
              <Ionicons name="time-outline" size={16} color={theme.colors.timeIcon} />{" "}
              {dataLocal.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert(
                "Excluir Consulta",
                "Deseja realmente excluir esta consulta?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await api.delete(`/consultas/${item.id}`);
                        setConsultas((prev) => prev.filter((c) => c.id !== item.id));
                        Alert.alert("Sucesso", "Consulta excluída!");
                      } catch (err) {
                        Alert.alert("Erro", "Não foi possível excluir a consulta.");
                      }
                    },
                  },
                ],
              )
            }
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    } catch (error) {
      console.error("Erro no renderItem:", error);
      return null;
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.bg, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontFamily: "Montserrat_400Regular", color: theme.colors.primary, fontSize: 18 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primaryDark }}>
      {Platform.OS === "android" && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: theme.colors.primaryDark }} />
      )}
      <StatusBar backgroundColor={theme.colors.primaryDark} barStyle="light-content" />

      <View style={styles.bg}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            <Text style={{ color: theme.colors.primary }}>Histórico</Text>{" "}
            <Text style={{ color: theme.colors.primaryDark }}>de Consultas</Text>
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : consultas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma consulta encontrada.</Text>
          ) : (
            <FlatList
              data={consultas}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 8 }}
              style={styles.list}
            />
          )}

          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.backBtn} style={{ marginRight: 5 }} />
            <Text style={styles.backBtnText}>Voltar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
  },
  card: {
    width: width * 0.94,
    maxWidth: 410,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 25,
    paddingHorizontal: 19,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 6,
    alignItems: "stretch",
    marginVertical: 100, 
    alignSelf: "center",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 18,
    color: theme.colors.text,
  },
  list: {
    maxHeight: height * 0.5,
    marginBottom: 8,
  },
  cardConsulta: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 7,
  },
  medico: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  especialidade: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 15,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.primaryDark,
    fontFamily: "Montserrat_600SemiBold",
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.timeIcon,
    fontFamily: "Montserrat_700Bold",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.primaryDark,
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    marginTop: 18,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    color: theme.colors.backBtn,
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: theme.colors.delete,
    borderRadius: theme.radius.sm,
    paddingVertical: 9,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
});
