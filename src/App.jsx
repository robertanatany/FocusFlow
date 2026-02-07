import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <AppRoutes /> {/* Agora o roteamento funciona! */}
            <ToastContainer position="bottom-right" autoClose={5000} />
        </>
    );
}
export default App;