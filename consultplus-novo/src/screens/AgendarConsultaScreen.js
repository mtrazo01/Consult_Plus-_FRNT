import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function AgendarConsultaScreen({ route, navigation }) {
  const { usuario } = route.params;
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const carregarEspecialidades = async () => {
      try {
        const espRes = await api.get('/especialidades');
        setEspecialidades(espRes.data);
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
      }
    };
    carregarEspecialidades();
  }, []);

  useEffect(() => {
    const carregarMedicos = async () => {
      if (!especialidadeSelecionada) return;
      try {
        const medRes = await api.get(`/medicos/especialidade/${especialidadeSelecionada}`);
        setMedicos(medRes.data);
      } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os médicos.');
      }
    };
    carregarMedicos();
  }, [especialidadeSelecionada]);

  const agendar = async () => {
    if (!especialidadeSelecionada || !medicoSelecionado) {
      Alert.alert('⚠️ Atenção', 'Selecione especialidade e médico');
      return;
    }

    try {
      const dataUtcString = data.toISOString();

      await api.post('/consultas', {
        usuario_id: usuario.id,
        medico_id: medicoSelecionado,
        data_hora: dataUtcString,
      });

      Alert.alert('✅ Sucesso', 'Consulta agendada com sucesso!');
      navigation.navigate('Home', { usuario });
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      Alert.alert('❌ Erro', 'Falha ao agendar consulta');
    }
  };

  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHora = (data) => {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B3D91' }}>
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: '#0B3D91' }} />
      )}
      <StatusBar backgroundColor="#0B3D91" barStyle="light-content" translucent={false} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Agendar Consulta</Text>

            <Text style={styles.label}>Especialidade</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={especialidadeSelecionada}
                onValueChange={(itemValue) => setEspecialidadeSelecionada(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione..." value="" />
                {especialidades.map((esp) => (
                  <Picker.Item key={esp.id} label={esp.nome} value={esp.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Profissional</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={medicoSelecionado}
                onValueChange={(itemValue) => setMedicoSelecionado(itemValue)}
                enabled={medicos.length > 0}
                style={styles.picker}
              >
                <Picker.Item label="Selecione..." value="" />
                {medicos.map((med) => (
                  <Picker.Item key={med.id} label={med.nome} value={med.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity onPress={() => setMostrarDataPicker(true)} style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={24} color="#1976D2" />
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>{formatarData(data)}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMostrarHoraPicker(true)} style={styles.infoCard}>
              <Ionicons name="time-outline" size={24} color="#1976D2" />
              <Text style={styles.infoLabel}>Hora</Text>
              <Text style={styles.infoValue}>{formatarHora(data)}</Text>
            </TouchableOpacity>

            {mostrarDataPicker && (
              <DateTimePicker
                value={data}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setMostrarDataPicker(false);
                  if (selectedDate) {
                    const novaData = new Date(data);
                    novaData.setFullYear(selectedDate.getFullYear());
                    novaData.setMonth(selectedDate.getMonth());
                    novaData.setDate(selectedDate.getDate());
                    setData(novaData);
                  }
                }}
              />
            )}

            {mostrarHoraPicker && (
              <DateTimePicker
                value={data}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setMostrarHoraPicker(false);
                  if (selectedTime) {
                    const novaData = new Date(data);
                    novaData.setHours(selectedTime.getHours());
                    novaData.setMinutes(selectedTime.getMinutes());
                    setData(novaData);
                  }
                }}
              />
            )}

            <TouchableOpacity style={styles.confirmBtn} onPress={agendar}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.confirmText}>Confirmar Agendamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('Home', { usuario })}
            >
              <Ionicons name="arrow-back" size={20} color="#1976D2" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  loadingText: { fontSize: 18, color: '#000' },
  card: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: '#0B3D91', textAlign: 'center', marginBottom: 20 },
  label: { fontFamily: 'Montserrat_600SemiBold', color: '#000', fontSize: 15, marginBottom: 6 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 14 },
  picker: { color: '#000' },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: { fontFamily: 'Montserrat_600SemiBold', color: '#000', fontSize: 15 },
  infoValue: { fontFamily: 'Montserrat_700Bold', color: '#0B3D91', fontSize: 16 },
  confirmBtn: {
    backgroundColor: '#0B3D91',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  confirmText: { fontFamily: 'Montserrat_700Bold', color: '#fff', fontSize: 16 },
  backBtn: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#1976D2', fontFamily: 'Montserrat_600SemiBold', fontSize: 15, marginLeft: 6 },
});
