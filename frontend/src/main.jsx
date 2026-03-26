import App from "./App";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ChakraProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ChakraProvider>
    </BrowserRouter>
);
