import { Stack } from 'expo-router';
import { Text, View, ActivityIndicator } from 'react-native';
import useCustomFonts from '../src/theme/fonts';

export default function RootLayout() {
  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  return <Stack />;
}
