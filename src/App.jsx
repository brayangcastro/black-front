// En App.js
import './App.css';
import AppRouter from './routes/AppRouter';
import { UserProvider } from'/src/UserContext';  // Asegúrate de que la ruta al archivo sea correcta
 
function App() {
  return (
    <div>
       <UserProvider>
      <AppRouter />
      </UserProvider>
    </div>
  );
}

export default App;
