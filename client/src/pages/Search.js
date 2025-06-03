import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  return (
    <Layout title={"Search Results"}>
      <div className="container py-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Search Results</h2>
          <p className="text-muted">
            {values?.result.length < 1
              ? "No products found"
              : `Found ${values.result.length} product(s)`}
          </p>
        </div>

        <div className="row g-4">
          {values?.result.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-truncate">
                    {product.description}
                  </p>
                  <p className="fw-bold">Price: ${product.price}</p>
                  <div className="mt-auto d-grid gap-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setCart([...cart, product]);
                        localStorage.setItem(
                          "Cart",
                          JSON.stringify([...cart, product])
                        );
                        toast.success("Item added to cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
