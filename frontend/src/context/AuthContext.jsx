
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const token = localStorage.getItem("credentialchain_token");

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        if (active) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error(
          "Authentication restoration failed:",
          error.response?.status,
          error.response?.data || error.message
        );

        localStorage.removeItem("credentialchain_token");

        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { token, user } = response.data;

    localStorage.setItem("credentialchain_token", token);
    setUser(user);

    return user;
  };

  const register = async (details) => {
    const response = await api.post("/auth/register", details);
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error("Registration response did not include a token and user");
    }

    localStorage.setItem("credentialchain_token", token);
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("credentialchain_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
