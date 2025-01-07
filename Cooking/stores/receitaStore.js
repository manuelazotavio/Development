import { create } from 'zustand'

const useReceitaStore = create((set) => ({
  receitas: [],
  setReceitas: (newReceitas) => set(() => ({ receitas: newReceitas })),
  addReceita: (newReceita) => set((state) => ({ receitas: [...state.receitas, newReceita] })),
  removeReceita: (id) => set((state) => {
    const receitasFiltradas = state.receitas.filter((receita => receita.id !== id))
    return {receitas: receitasFiltradas}
  }),
  updateReceita: (newReceita) => set((state) => ({ receitas: state.receitas.map((receita) => (receita.id === newReceita.id ? newReceita : receita))})),
}))

export default useReceitaStore

//state guarda o valor atual de todos os estados como um objeto