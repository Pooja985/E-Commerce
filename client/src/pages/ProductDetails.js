import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/similar-products/${pid}/${cid}`
      );
      setSimilarProducts(data?.products);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  return (
    <Layout>
      {/* Product Section */}
      <div className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center">
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "450px", objectFit: "contain" }}
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3 text-center">Product Details</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Name:</strong> {product.name}
              </li>
              <li className="list-group-item">
                <strong>Description:</strong> {product.description}
              </li>
              <li className="list-group-item">
                <strong>Price:</strong> ${product.price}
              </li>
              <li className="list-group-item">
                <strong>Category:</strong> {product?.category?.name}
              </li>
            </ul>
            <div className="mt-4 d-grid gap-2">
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

      {/* Similar Products Section */}
      <div className="container py-4">
        <h3 className="mb-4 text-center">Similar Products</h3>
        {similarProducts.length < 1 ? (
          <p className="text-center text-muted">No similar product found</p>
        ) : (
          <div className="row g-4">
            {similarProducts.map((product) => (
              <div key={product._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "220px", objectFit: "cover" }}
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
                        View Details
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
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
