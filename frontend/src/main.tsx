import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App.tsx'
import './index.css'
import '@fontsource/geist-sans'; // Defaults to weight 400
import '@fontsource/geist-sans/500.css'; // Weight 500
import '@fontsource/geist-sans/600.css'; // Weight 600

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)
