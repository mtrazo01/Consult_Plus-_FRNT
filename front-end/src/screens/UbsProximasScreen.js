import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function UbsProximasScreen({ navigation, route }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedUbs, setSelectedUbs] = useState(null);

  const ubsList = [
    {
      id: 1,
      nome: "UBS Genefredo Monteiro",
      endereco: "Rua General Carneiro, 211 - Centro",
      telefone: "(15) 3272-8900 / 3272-5115",
      latitude: -23.5894,
      longitude: -48.0531,
    },
    {
      id: 2,
      nome: "UBS Dr. Cid de Melo Almada - Rio Branco",
      endereco: "Av. Waldomiro de Carvalho, 180 - Vila Rio Branco",
      telefone: "(15) 3271-7040 / 3272-7474",
      latitude: -23.58986,
      longitude: -48.06665,
    },
    {
      id: 3,
      nome: "UBS Tsuyoshi Honma - Jardim Mesquita",
      endereco: "Rua Esaú Isaac, 350 - Jardim Mesquita",
      telefone: "(15) 3273-4674 / 3373-2637",
      latitude: -23.57338,
      longitude: -48.02407,
    },
    {
      id: 4,
      nome: "UBS Joaquim Corrêa de Lara Filho - Nova Itapetininga",
      endereco: "Rua Heitor Calazans Moura, 281 - Nova Itapetininga",
      telefone: "(15) 3273-4675",
      latitude: -23.59518,
      longitude: -48.03092,
    },
    {
      id: 5,
      nome: "UBS Wilson Antunes Brito - Belo Horizonte",
      endereco: "Rua Gov. Lucas Nogueira Garcês, 301 - Belo Horizonte",
      telefone: "(15) 3271-9676 / 3271-1547",
      latitude: -23.56068,
      longitude: -48.04193,
    },
    {
      id: 6,
      nome: "Vigilância Epidemiológica Municipal",
      endereco: "Rua Plácido Cardoso, 140 - Jardim Mesquita",
      telefone: "(15) 3373-8756",
      latitude: -23.57331,
      longitude: -48.02423,
    },
    {
      id: 7,
      nome: "NASF - NUCLEO APOIO SAUDE DA FAMILIA",
      endereco: "Rua Padre Albuquerque, 395 - Centro",
      telefone: "(15) 3275-2219",
      latitude: -23.58426,
      longitude: -48.04411,
    },
    {
      id: 8,
      nome: "USF Srta Marcia Regina Sardela Vila Arruda",
      endereco: "Rua Itapetininga, 357 - Vila Arruda",
      telefone: "(15) 3373-4413",
      latitude: -23.57448,
      longitude: -48.03800,
    },
    {
      id: 9,
      nome: "USF Dr. Valdomiro de Oliveira - Chapadinha",
      endereco: "Rua Gumercindo Soares Hungria, s/n - Chapadinha",
      telefone: "(15) 3272-8623",
      latitude: -23.62638,
      longitude: -48.04418,
    },
    {
      id: 10,
      nome: "USF Veranice Costa Tatino - Vila Santana",
      endereco: "Rua Urias de Campos, s/n - Vila Santana",
      telefone: "(15) 3275-1417",
      latitude: -23.57954,
      longitude: -48.05375,
    },
    {
      id: 11,
      nome: "USF Dr. Carlos Amadeu de Oliveira - Vila Mazzei",
      endereco: "Rua Cristovão Colombo, 151 - Vila Mazzei",
      telefone: "(15) 3272-3700",
      latitude: -23.57466,
      longitude: -48.07810,
    },
    {
      id: 12,
      nome: "USF Dr. Salvador Corrêa de Almeida Moraes - Rechã",
      endereco: "Rua Pedro Ayres Ventura, 71 - Rechã",
      telefone: "(15) 99724-6309",
      latitude: -23.59717,
      longitude: -48.31521,
    },
    {
      id: 13,
      nome: "USF Conceição Thibes do Canto - Tupy",
      endereco: "Rua Salvador de Andrade Canto, s/n - Tupy",
      telefone: "(15) 3372-1001",
      latitude: -23.54736,
      longitude: -48.23861,
    },
    {
      id: 14,
      nome: "USF Edgar Pinto Vallada - Gramadinho",
      endereco: "Rua Hermínia de Freitas, 92 - Gramadinho",
      telefone: "(15) 3207-1151",
      latitude: -23.76825,
      longitude: -48.12914,
    },
    {
      id: 15,
      nome: "USF Aurora dos Santos Leme - Varginha",
      endereco: "Estrada João Isaac, s/n - Varginha",
      telefone: "(15) 3207-7288",
      latitude: -23.73040,
      longitude: -48.19989,
    },
    {
      id: 16,
      nome: "USF Gaspar João Ferraz - Morro do Alto",
      endereco: "Rua João Ayres da Rocha, 46 - Morro do Alto",
      telefone: "(15) 99824-9114",
      latitude: -23.48432,
      longitude: -47.95775,
    },
    {
      id: 17,
      nome: "USF Capão Alto",
      endereco: "Estrada do Capão Alto, km 14",
      telefone: "(15) 99829-8193",
      latitude: -23.45688,
      longitude: -48.03598,
    },
    {
      id: 18,
      nome: "Pronto Atendimento - Jardim Mesquita",
      endereco: "Rua Esaú Isaac, 350 - Jardim Mesquita",
      telefone: "(15) 3373-4674",
      latitude: -23.57341,
      longitude: -48.02391,
    },
    {
      id: 19,
      nome: "USF João Bianco Cavalheiro Salem - Taboãozinho",
      endereco: "Rua José Ferreira Menk, s/n - Taboãozinho",
      telefone: "(15) 3373-2239",
      latitude: -23.57715,
      longitude: -48.00546,
    },
    {
      id: 20,
      nome: "USF Jacqueline Cardozo Vieira - Jardim Fogaça",
      endereco: "Rua Benedito Bento Mariano, 291 - Jardim Fogaça",
      telefone: "(15) 3373-5383",
      latitude: -23.58422,
      longitude: -48.01479,
    },
    {
      id: 21,
      nome: "USF Miguel Ayub - Monte Santo",
      endereco: "Rua José Martinho Asem, 300 - Jardim Monte Santo",
      telefone: "(15) 3273-2462",
      latitude: -23.58983,
      longitude: -47.98015,
    },
    {
      id: 22,
      nome: "Pronto Atendimento - Rio Branco",
      endereco: "Av. Waldomiro de Carvalho, 180 - Vila Rio Branco",
      telefone: "(15) 3272-7040",
      latitude: -23.58990,
      longitude: -48.06661,
    },
    {
      id: 23,
      nome: "PAS Bela Vista",
      endereco: "Rua Cleonice Tambelli Fernandes Gonzaga, 70 - Jardim Bela Vista",
      telefone: "(15) 3271-2419",
      latitude: -23.60958,
      longitude: -48.07737,
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão negada para acessar sua localização.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const abrirRota = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  const ligar = (telefone) => {
    Linking.openURL(`tel:${telefone.replace(/\D/g, "")}`);
  };

  return (
    <LinearGradient colors={["#F8FAFC", "#FFFFFF"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#0D47A1" />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate("Home", { usuario: route.params?.usuario })
            }
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>UBS e USF Próximas</Text>

          <View style={styles.headerIcon}>
            <MaterialIcons name="local-hospital" size={28} color="#BBDEFB" />
          </View>
        </View>

        {/* Mapa */}
        <View style={styles.mapContainer}>
          {location ? (
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.09,
                longitudeDelta: 0.09,
              }}
              showsUserLocation
              showsMyLocationButton
              loadingEnabled
            >
              {ubsList.map((ubs) => (
                <Marker
                  key={ubs.id}
                  coordinate={{
                    latitude: ubs.latitude,
                    longitude: ubs.longitude,
                  }}
                  pinColor="#1565C0"
                  onPress={() => setSelectedUbs(ubs)}
                />
              ))}
            </MapView>
          ) : (
            <View style={styles.loadingBox}>
              {errorMsg ? (
                <Text style={styles.loadingText}>{errorMsg}</Text>
              ) : (
                <>
                  <ActivityIndicator size="large" color="#1565C0" />
                  <Text style={styles.loadingText}>
                    Obtendo sua localização...
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Detalhes */}
        {selectedUbs && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>{selectedUbs.nome}</Text>
            <Text style={styles.detailsText}>{selectedUbs.endereco}</Text>
            <Text style={styles.detailsText}>
              Telefone: {selectedUbs.telefone}
            </Text>
            <View style={styles.detailsButtons}>
              <TouchableOpacity
                style={styles.routeButton}
                onPress={() =>
                  abrirRota(selectedUbs.latitude, selectedUbs.longitude)
                }
              >
                <Ionicons name="navigate-circle" size={20} color="#fff" />
                <Text style={styles.routeButtonText}>Rota</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.routeButton, { backgroundColor: "#388E3C" }]}
                onPress={() => ligar(selectedUbs.telefone)}
              >
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.routeButtonText}>Ligar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Toque nos marcadores para visualizar detalhes da UBS 🏥
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#0D47A1",
    height: 90,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  backButton: {
    backgroundColor: "#1565C0",
    padding: 8,
    borderRadius: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerIcon: {
    backgroundColor: "#1565C0",
    padding: 6,
    borderRadius: 20,
  },
  mapContainer: {
    height: 590,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#333",
    fontSize: 15,
    marginTop: 10,
  },
  detailsBox: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D47A1",
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  detailsButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  routeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976D2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  routeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  footer: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderTopWidth: 1,
    borderTopColor: "#BBDEFB",
  },
  footerText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
  },
});
