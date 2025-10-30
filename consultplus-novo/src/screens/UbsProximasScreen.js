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
      latitude: -23.5985,
      longitude: -48.0488,
    },
    {
      id: 3,
      nome: "UBS Tsuyoshi Honma - Jardim Mesquita",
      endereco: "Rua Esaú Isaac, 350 - Jardim Mesquita",
      telefone: "(15) 3273-4674 / 3373-2637",
      latitude: -23.5968,
      longitude: -48.0309,
    },
    {
      id: 4,
      nome: "UBS Joaquim Corrêa de Lara Filho - Nova Itapetininga",
      endereco: "Rua Heitor Calazans Moura, 281 - Nova Itapetininga",
      telefone: "(15) 3273-4675",
      latitude: -23.5933,
      longitude: -48.0402,
    },
    {
      id: 5,
      nome: "UBS Wilson Antunes Brito - Belo Horizonte",
      endereco: "Rua Gov. Lucas Nogueira Garcês, 301 - Belo Horizonte",
      telefone: "(15) 3271-9676 / 3271-1547",
      latitude: -23.6201,
      longitude: -48.0303,
    },
    {
      id: 6,
      nome: "UBS Vila Nova",
      endereco: "Rua José Soares, 230 - Vila Nova",
      telefone: "(15) 3272-8904",
      latitude: -23.600785,
      longitude: -48.050682,
    },
    {
      id: 7,
      nome: "UBS Vila Barth",
      endereco: "Rua João Vieira Camargo, 75 - Vila Barth",
      telefone: "(15) 3273-4511",
      latitude: -23.6034,
      longitude: -48.0617,
    },
    {
      id: 8,
      nome: "UBS Vila Prado",
      endereco: "Rua Pedro Marques, 260 - Vila Prado",
      telefone: "(15) 3271-3160",
      latitude: -23.6027,
      longitude: -48.0508,
    },
    {
      id: 9,
      nome: "USF Dr. Valdomiro de Oliveira - Chapadinha",
      endereco: "Rua Gumercindo Soares Hungria, s/n - Chapadinha",
      telefone: "(15) 3272-8623",
      latitude: -23.6191,
      longitude: -48.0599,
    },
    {
      id: 10,
      nome: "USF Veranice Costa Tatino - Vila Santana",
      endereco: "Rua Urias de Campos, s/n - Vila Santana",
      telefone: "(15) 3275-1417",
      latitude: -23.6042,
      longitude: -48.0445,
    },
    {
      id: 11,
      nome: "USF Dr. Carlos Amadeu de Oliveira - Vila Mazzei",
      endereco: "Rua Cristovão Colombo, 151 - Vila Mazzei",
      telefone: "(15) 3272-3700",
      latitude: -23.5970,
      longitude: -48.0500,
    },
    {
      id: 12,
      nome: "USF Dr. Salvador Corrêa de Almeida Moraes - Rechã",
      endereco: "Rua Pedro Ayres Ventura, 71 - Rechã",
      telefone: "(15) 99724-6309",
      latitude: -23.6000,
      longitude: -48.0380,
    },
    {
      id: 13,
      nome: "USF Conceição Thibes do Canto - Tupy",
      endereco: "Rua Salvador de Andrade Canto, s/n - Tupy",
      telefone: "(15) 3372-1001",
      latitude: -23.6100,
      longitude: -48.0420,
    },
    {
      id: 14,
      nome: "USF Edgar Pinto Vallada - Gramadinho",
      endereco: "Rua Hermínia de Freitas, 92 - Gramadinho",
      telefone: "(15) 3207-1151",
      latitude: -23.6150,
      longitude: -48.0350,
    },
    {
      id: 15,
      nome: "USF Aurora dos Santos Leme - Varginha",
      endereco: "Estrada João Isaac, s/n - Varginha",
      telefone: "(15) 3207-7288",
      latitude: -23.6200,
      longitude: -48.0250,
    },
    {
      id: 16,
      nome: "USF Gaspar João Ferraz - Morro do Alto",
      endereco: "Rua João Ayres da Rocha, 46 - Morro do Alto",
      telefone: "(15) 99824-9114",
      latitude: -23.6120,
      longitude: -48.0450,
    },
    {
      id: 17,
      nome: "USF Capão Alto",
      endereco: "Estrada do Capão Alto, km 14",
      telefone: "(15) 99829-8193",
      latitude: -23.6050,
      longitude: -48.0600,
    },
    {
      id: 18,
      nome: "USF Marcia Refina Sardeia - Vila Arruda",
      endereco: "Rua Evilásio Massaine Pires, 357 - Vila Arruda",
      telefone: "(15) 3373-4413",
      latitude: -23.6090,
      longitude: -48.0500,
    },
    {
      id: 19,
      nome: "USF João Bianco Cavalheiro Salem - Taboãozinho",
      endereco: "Rua José Ferreira Menk, s/n - Taboãozinho",
      telefone: "(15) 3373-2239",
      latitude: -23.6070,
      longitude: -48.0550,
    },
    {
      id: 20,
      nome: "USF Jacqueline Cardozo Vieira - Jardim Fogaça",
      endereco: "Rua Benedito Bento Mariano, 291 - Jardim Fogaça",
      telefone: "(15) 3373-5383",
      latitude: -23.6080,
      longitude: -48.0530,
    },
    {
      id: 21,
      nome: "USF Miguel Ayub - Monte Santo",
      endereco: "Rua José Martinho Asem, 300 - Jardim Monte Santo",
      telefone: "(15) 3273-2462",
      latitude: -23.6105,
      longitude: -48.0515,
    },
    {
      id: 22,
      nome: "USF Santa Inês",
      endereco: "Rua Benedito Rodrigues de Almeida, 60 - Jardim Santa Inês",
      telefone: "(15) 3271-4243",
      latitude: -23.6207,
      longitude: -48.0431,
    },
    {
      id: 23,
      nome: "USF Distrito do Gramadão",
      endereco: "Rua Principal, s/n - Distrito do Gramadão",
      telefone: "(15) 99725-7003",
      latitude: -23.6935,
      longitude: -48.0612,
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
