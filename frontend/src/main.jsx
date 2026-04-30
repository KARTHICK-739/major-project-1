import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Check, ChevronDown, EyeOff, Trash2 } from "lucide-react";
import "./styles.css";

const API_URL = "http://127.0.0.1:8000/api";

const fallbackProducts = [
  {
    id: 1,
    name: "Airpods Wireless Bluetooth Headphones",
    brand: "Apple",
    category: "Electronics",
    description:
      "Bluetooth technology lets you connect it with compatible devices wirelessly. High-quality AAC audio offers immersive listening experience and built-in microphone allows you to take calls while working.",
    price: 25000,
    rating: 4.5,
    reviewCount: 125,
    countInStock: 7,
    image: "/assets/airpods.svg",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    category: "Mobiles",
    description:
      "Titanium design, powerful A17 Pro performance, crisp Super Retina display, and a pro camera system for everyday photos and video.",
    price: 99999,
    rating: 4.5,
    reviewCount: 1000,
    countInStock: 4,
    image: "/assets/iphone.svg",
  },
  {
    id: 3,
    name: "Cannon EOS 80D DSLR Camera",
    brand: "Cannon",
    category: "Cameras",
    description:
      "A versatile DSLR camera for crisp photography, full HD video, fast autofocus, and dependable handling for travel or studio work.",
    price: 12500,
    rating: 3.5,
    reviewCount: 10,
    countInStock: 5,
    image: "/assets/camera.svg",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    category: "Audio",
    description:
      "Noise-cancelling wireless headphones with soft ear cushions, long battery life, and rich sound for study, work, and travel.",
    price: 29990,
    rating: 4.8,
    reviewCount: 248,
    countInStock: 8,
    image: "/assets/headphones.svg",
  },
  {
    id: 5,
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "Wearables",
    description:
      "A bright smartwatch with fitness tracking, sleep insights, notifications, and a clean circular design for everyday use.",
    price: 18999,
    rating: 4.2,
    reviewCount: 89,
    countInStock: 12,
    image: "/assets/watch.svg",
  },
  {
    id: 6,
    name: "Dell XPS 13 Laptop",
    brand: "Dell",
    category: "Computers",
    description:
      "Slim premium laptop with fast performance, edge-to-edge display, and lightweight build for productivity on the move.",
    price: 84999,
    rating: 4.6,
    reviewCount: 64,
    countInStock: 3,
    image: "/assets/laptop.svg",
  },
];

function formatPrice(value) {
  return Number(value).toFixed(2);
}

function titleCasePath(path) {
  return path.replace("/", "") || "home";
}

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { path, navigate };
}

function Header({ navigate, path, cartCount, user }) {
  const links = [
    ["Home", "/"],
    ["Cart", "/cart"],
    ["Checkout", "/checkout"],
  ];

  if (!user) {
    links.push(["Signup", "/signup"], ["Login", "/login"]);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate("/")}>
          Ecommerce GUVI Shop
        </button>
        <nav>
          {links.map(([label, href]) => (
            <button
              key={href}
              className={path === href ? "active" : ""}
              onClick={() => navigate(href)}
            >
              {label}
              {href === "/cart" && cartCount > 0 ? <span>{cartCount}</span> : null}
            </button>
          ))}
          {user ? (
            <button className="welcome">
              Welcome <ChevronDown size={14} />
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function ProductCard({ product, navigate }) {
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.image} alt={product.name} />
      </button>
      <button className="product-title" onClick={() => navigate(`/product/${product.id}`)}>
        {product.name}
      </button>
      <p className="rating">
        {formatPrice(product.rating)} from {product.reviewCount} reviews
      </p>
      <p className="price">Rs {formatPrice(product.price)}</p>
      <button className="text-link" onClick={() => navigate(`/product/${product.id}`)}>
        View More
      </button>
    </article>
  );
}

function Home({ products, navigate }) {
  return (
    <main className="container">
      <h1 className="page-title">Latest Products</h1>
      <section className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} navigate={navigate} />
        ))}
      </section>
    </main>
  );
}

function ProductDetail({ product, navigate, addToCart }) {
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="container">
        <button className="dark-button" onClick={() => navigate("/")}>Go Back</button>
        <p className="empty">Product not found.</p>
      </main>
    );
  }

  return (
    <main className="container product-detail">
      <button className="dark-button" onClick={() => navigate("/")}>Go Back</button>
      <div className="detail-grid">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <section className="detail-info">
          <h1>{product.name}</h1>
          <div className="rule" />
          <p className="rating">
            Rating : {formatPrice(product.rating)} | No. of reviews {product.reviewCount}
          </p>
          <div className="rule" />
          <p className="description">Description : {product.description}</p>
          <div className="rule" />
          <p className="detail-price">Price : {formatPrice(product.price)}</p>
        </section>
        <aside className="buy-box">
          <div><span>Status</span><strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong></div>
          <div><span>Category</span><strong>{product.category}</strong></div>
          <div><span>Brand</span><strong>{product.brand}</strong></div>
          <div>
            <span>Qty</span>
            <input
              min="1"
              max={product.countInStock}
              type="number"
              value={qty}
              onChange={(event) => setQty(Number(event.target.value))}
            />
          </div>
          <button className="primary-button" onClick={() => addToCart(product, qty)}>
            Add to Cart
          </button>
        </aside>
      </div>
    </main>
  );
}

function Cart({ cart, navigate, removeFromCart }) {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <main className="container cart-page">
      <section>
        <h1 className="section-title">Cart Items</h1>
        {cart.length === 0 ? (
          <p className="empty">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div className="cart-row" key={item.id}>
              <img src={item.image} alt={item.name} />
              <button onClick={() => navigate(`/product/${item.id}`)}>{item.name}</button>
              <p>Rs {formatPrice(item.price)}</p>
              <p>Qty: {item.qty}</p>
              <button className="icon-button" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </section>
      <aside className="summary-box">
        <h2>Total Qty : ({totalQty}) Items</h2>
        <p>Rs. {formatPrice(total)}</p>
        <button className="primary-button" onClick={() => navigate("/checkout")} disabled={!cart.length}>
          Proceed to Checkout
        </button>
      </aside>
    </main>
  );
}

function FormInput({ label, type = "text", value, onChange, placeholder, valid }) {
  return (
    <label className={valid ? "form-field valid" : "form-field"}>
      <span>{label}</span>
      <div className="input-wrap">
        {type === "password" ? <EyeOff size={18} /> : null}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        {valid ? <Check className="check" size={26} /> : null}
      </div>
    </label>
  );
}

function AuthPage({ mode, navigate, onAuth }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [message, setMessage] = useState("");

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    if (isSignup && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/${isSignup ? "register" : "login"}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Request failed");
      onAuth(data);
      navigate("/");
    } catch (error) {
      if (isSignup) {
        onAuth({ email: form.email, firstName: form.firstName });
        navigate("/");
      } else {
        setMessage(error.message);
      }
    }
  }

  return (
    <main className="auth-container">
      <h1 className="page-title">{isSignup ? "Signup Here" : "Login Here"}</h1>
      <form onSubmit={submit} className="auth-form">
        {isSignup ? (
          <>
            <FormInput label="First Name" value={form.firstName} onChange={(v) => setValue("firstName", v)} placeholder="Enter your first name" valid={form.firstName.length > 1} />
            <FormInput label="Last Name" value={form.lastName} onChange={(v) => setValue("lastName", v)} placeholder="Enter your last name" />
          </>
        ) : null}
        <FormInput label="Email" type="email" value={form.email} onChange={(v) => setValue("email", v)} placeholder="Enter your Email" valid={form.email.includes("@")} />
        <FormInput label="Password" type="password" value={form.password} onChange={(v) => setValue("password", v)} placeholder="Enter your Password" />
        {isSignup ? (
          <>
            <FormInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(v) => setValue("confirmPassword", v)} placeholder="Confirm Password" />
            <label className="terms"><input type="checkbox" checked={form.terms} onChange={(event) => setValue("terms", event.target.checked)} />Agree to terms and conditions</label>
          </>
        ) : null}
        {message ? <p className="message">{message}</p> : null}
        <button className="primary-button" type="submit">{isSignup ? "Signup" : "Login"}</button>
        {!isSignup ? <p>New User?<button className="inline-link" type="button" onClick={() => navigate("/signup")}>Signup</button></p> : null}
      </form>
    </main>
  );
}

function Checkout({ cart, navigate, user, placeOrder }) {
  const [shipping, setShipping] = useState({ address: "", city: "", pinCode: "", country: "" });
  const [placed, setPlaced] = useState(null);

  async function submit(event) {
    event.preventDefault();
    const order = await placeOrder(shipping);
    setPlaced(order);
  }

  if (placed) {
    return (
      <main className="auth-container">
        <h1 className="page-title">Order Placed</h1>
        <div className="order-success">
          <p>Thank you {user?.firstName || "shopper"}. Your order #{placed.id || "local"} is confirmed.</p>
          <button className="primary-button" onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      <div className="steps">
        <span>Login</span><span>Checkout</span><span>Payment</span><span>Place Order</span>
      </div>
      <h1 className="section-title">Shipping</h1>
      <form className="auth-form" onSubmit={submit}>
        {["address", "city", "pinCode", "country"].map((key) => (
          <FormInput
            key={key}
            label={key === "pinCode" ? "Pin Code" : key[0].toUpperCase() + key.slice(1)}
            value={shipping[key]}
            onChange={(value) => setShipping((current) => ({ ...current, [key]: value }))}
            placeholder={key === "pinCode" ? "Enter postal code" : `Enter ${key}`}
          />
        ))}
        <button className="primary-button" type="submit" disabled={!cart.length}>Continue</button>
      </form>
    </main>
  );
}

function App() {
  const { path, navigate } = useRoute();
  const [products, setProducts] = useState(fallbackProducts);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("guvi-cart") || "[]"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("guvi-user") || "null"));

  useEffect(() => {
    fetch(`${API_URL}/products/`)
      .then((response) => response.json())
      .then((data) => Array.isArray(data) && setProducts(data))
      .catch(() => setProducts(fallbackProducts));
  }, []);

  useEffect(() => localStorage.setItem("guvi-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("guvi-user", JSON.stringify(user)), [user]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const productMatch = path.match(/^\/product\/(\d+)/);
  const product = productMatch ? products.find((item) => item.id === Number(productMatch[1])) : null;

  function addToCart(item, qty) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, qty } : cartItem);
      }
      return [...current, { ...item, qty }];
    });
    navigate("/cart");
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  async function placeOrder(shipping) {
    const body = {
      customerName: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
      email: user?.email || "",
      shipping,
      items: cart,
      paymentMethod: "Cash on Delivery",
    };

    try {
      const response = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const order = await response.json();
      setCart([]);
      return order;
    } catch {
      setCart([]);
      return { id: "local" };
    }
  }

  let page = <Home products={products} navigate={navigate} />;
  if (productMatch) page = <ProductDetail product={product} navigate={navigate} addToCart={addToCart} />;
  if (path === "/cart") page = <Cart cart={cart} navigate={navigate} removeFromCart={removeFromCart} />;
  if (path === "/login") page = <AuthPage mode="login" navigate={navigate} onAuth={setUser} />;
  if (path === "/signup") page = <AuthPage mode="signup" navigate={navigate} onAuth={setUser} />;
  if (path === "/checkout") page = <Checkout cart={cart} navigate={navigate} user={user} placeOrder={placeOrder} />;

  document.title = `${titleCasePath(path)} | Ecommerce GUVI Shop`;

  return (
    <>
      <Header navigate={navigate} path={path} cartCount={cartCount} user={user} />
      {page}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
