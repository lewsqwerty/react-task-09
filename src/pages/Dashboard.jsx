import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProducts, addProduct } from "../api/api";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("https://via.placeholder.com/300");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILE SELECTION FUNCTION ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create an image to resize (Prevents "Payload Too Large" errors)
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setThumbnail(dataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = await addProduct(
        title,
        Number(price),
        category,
        thumbnail,
      );
      setProducts([...products, newProduct]);

      // Reset Form
      setTitle("");
      setPrice("");
      setCategory("");
      setThumbnail("https://via.placeholder.com/300");
    } catch (error) {
      console.error("Add product error:", error);
      alert("Failed to add product. Please check the file size.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md px-8 py-5 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-bold text-2xl text-gray-800">
              Welcome, {user?.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your inventory</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {/* Add Product Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add New Product
          </h2>

          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div className="flex gap-3 flex-wrap">
              <input
                placeholder="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                placeholder="Price ($)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* IMAGE UPLOAD AREA */}
            <div className="flex items-center gap-4 border-t pt-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Upload Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Preview</span>
                <img
                  src={thumbnail}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-lg border shadow-sm"
                />
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg transition font-medium shadow-sm w-full md:w-max">
              Add Product
            </button>
          </form>
        </div>

        {/* Product List Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Product List
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {p.category}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="font-bold text-xl text-blue-600">
                        ${p.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
