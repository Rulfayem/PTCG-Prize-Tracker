//react import(s)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//library import(s)
import { BrowserRouter } from 'react-router-dom'

//context import(s)
import { UserProvider } from './context/UserContext.jsx';

//component import(s)
import App from './App.jsx'

//style import(s)
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)
