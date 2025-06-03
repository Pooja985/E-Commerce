import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();

  const getProductByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProduct(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProductByCat();
  }, [params?.slug]);

  return (
    <Layout>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Category: {category?.name}</h2>
          <p className="text-muted">{product?.length} result(s) found</p>
        </div>
        <div className="row g-4">
          {product.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                  className="card-img-top object-fit-cover"
                  alt={product.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-truncate">
                    {product.description}
                  </p>
                  <div className="mt-auto">
                    <p className="fw-bold">Price: ${product.price}</p>
                    <div className="d-grid gap-2">
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
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
