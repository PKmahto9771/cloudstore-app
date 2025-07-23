import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
            } catch (error) {
                console.error("Logout failed:", error);
            }
            navigate("/");
        };
        logout();
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;