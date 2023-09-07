import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const currentUser = localStorage.getItem("userInfo");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false); // Set loading to false once user data is retrieved
  }, []);

  return { user, loading }; // Return user and loading state
}
