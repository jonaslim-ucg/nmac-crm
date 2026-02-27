import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { FaSpinner } from 'react-icons/fa6'
import { persistor } from './redux/store.ts'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={<FaSpinner />} persistor={persistor}>
      <RouterProvider router={router} />
      <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme="light"
                transition={Bounce}
              />
      </PersistGate>
    </Provider>
  </StrictMode>
)
