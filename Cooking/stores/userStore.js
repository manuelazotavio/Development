import { create } from 'zustand'

const useUserStore = create((set) => ({
  users: [],
  setUsers: (newUsers) => set(() => ({ users: newUsers })),
  addUser: (newUser) => set((state) => ({ users: [...state.users, newUser] })),
  removeUser: (id) => set((state) => {
    const filteredUsers = state.users.filter((user => user.id !== id))
    return {users: filteredUsers}
  }),
  updateUser: (newUser) => set((state) => ({ users: state.users.map((user) => (user.id === newUser.id ? newUser : user))})),
}))

export default useUserStore

