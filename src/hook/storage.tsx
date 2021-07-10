import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface IStorageProviderProps {
  children: ReactNode
}

interface ILoginData {
  id: string;
  title: string;
  email: string;
  password: string;
};

interface IStorageContextData {
  loginDataList: ILoginData[]
  getLoginData: () => Promise<ILoginData[]>
  setLoginData: (loginData: ILoginData) => Promise<void>
}

const StorageContext = createContext({} as IStorageContextData)

export function StorageProvider({ children }: IStorageProviderProps) {
  const [loginDataList, setLoginDataList] = useState<ILoginData[]>([])

  const storageKey = '@passmanager:logins'

  async function getLoginData() {
    const data = await AsyncStorage.getItem(storageKey)
    const formattedData: ILoginData[] = data ? JSON.parse(data) : []
    return formattedData
  }

  async function setLoginData(loginDataItem: ILoginData) {
    const newLoginDataList = [...loginDataList, loginDataItem]
    await AsyncStorage.setItem(storageKey, JSON.stringify(newLoginDataList))
    setLoginDataList(newLoginDataList)
  }

  useEffect(() => {
    async function loadData() {
      const data = await getLoginData()
      setLoginDataList(data)
    }

    loadData()
  }, [])

  return (
    <StorageContext.Provider value={{
      loginDataList,
      getLoginData,
      setLoginData
    }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)

  return context
}