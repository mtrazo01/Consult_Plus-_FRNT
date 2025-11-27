import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from "@expo-google-fonts/montserrat";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen({ route, navigation }) {
  const [usuario, setUsuario] = useState(route.params?.usuario || null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
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
        <Text style={styles.loaderText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B3D91" }}>
      {Platform.OS === "android" && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: "#0B3D91" }} />
      )}
      <StatusBar backgroundColor="#0B3D91" barStyle="light-content" translucent={false} />
      <View style={styles.bg}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.headerArea}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/login-illustration.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>ConsultPlus</Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: "Login" }] })
              }
            >
              <MaterialIcons name="logout" size={30} color="#D32F2F" />
            </TouchableOpacity>
          </View>

          <Text style={styles.saudacao}>Bem-vindo,</Text>
          <Text style={styles.nome}>{usuario?.nome?.trim() || "Usuário"}</Text>

          <View style={styles.row}>
            <HomeButton
              icon="calendar-outline"
              label="Agendar Consulta"
              color="#1976D2"
              onPress={() => navigation.navigate("AgendarConsulta", { usuario })}
            />
            <HomeButton
              icon="time-outline"
              label="Agendamentos"
              color="#0288D1"
              onPress={() => navigation.navigate("HistoricoConsultas", { usuario })}
            />
          </View>

          <View style={styles.row}>
            <HomeButton
              icon="person-circle-outline"
              label="Editar Perfil"
              color="#388E3C"
              onPress={() =>
                navigation.navigate("Perfil", {
                  usuario,
                  setUsuario, // Passando o setter para a tela Perfil
                })
              }
            />
            <HomeButton
              icon="location-outline"
              label="UBS Próximas"
              color="#FBC02D"
              onPress={() => navigation.navigate("UbsProximas", { usuario })}
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function HomeButton({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.cardBtn} activeOpacity={0.85} onPress={onPress}>
      <Ionicons name={icon} size={38} color={color} />
      <Text style={styles.cardBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const CARD_SIZE = (width * 0.9 - 32) / 2;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loaderText: {
    fontFamily: "Montserrat_400Regular",
    color: "#000",
    fontSize: 18,
  },
  card: {
    width: width * 0.94,
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  headerArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 46,
    height: 46,
    marginRight: 10,
  },
  logoText: {
    fontFamily: "Montserrat_700Bold",
    color: "#0B3D91",
    fontSize: 22,
    letterSpacing: 0.8,
  },
  saudacao: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 17,
    color: "#000",
  },
  nome: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 23,
    color: "#0B3D91",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardBtn: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBDEFB",
    elevation: 2,
  },
  cardBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#000",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
});
