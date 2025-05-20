const fetchPurchases = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/purchases", {
      headers: { "x-auth-token": token },
    });
    console.log(res.data); // Display purchases
  } catch (err) {
    console.error(err.response?.data?.error || "Failed to fetch purchases");
  }
};