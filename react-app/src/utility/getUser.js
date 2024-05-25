// getUser.js
const getCurrentUser = () => {
    let currentUser;
    try {
      const storedUser = localStorage.getItem("user");
      currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      currentUser = null;
    }
    return currentUser;
  };
  
  export default getCurrentUser;
  