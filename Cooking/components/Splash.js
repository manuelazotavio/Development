import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    fetchReceitas();
  }, []);

  const fetchReceitas = async () => {
    try {
      const response = await fetch('https://backcooking.onrender.com/receita');
      const data = await response.json();
      setReceitas(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Text>Carregando...</Text>;
  }

  if (receitas.length === 0) {
    return <Text>Você não tem nenhuma receita cadastrada.</Text>;
  }

  return (
    <View>
      {/* Renderize suas receitas aqui */}
    </View>
  );
};

export default Splash;