import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [checkedRadio, setCheckedRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-count`);
      setTotal(data.count);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching total products");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category`);
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching categories");
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching products");
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts((prev) => [...prev, ...data.products]);
    } catch (error) {
      console.error(error);
      toast.error("Error loading more products");
    }
  };

  const handleFilter = (value, id) => {
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const getFilteredProduct = async () => {
    try {
      const { data } = await axios.post(`/api/v1/product/product-filter`, {
        checked,
        checkedRadio,
      });
      setProducts(data?.product);
    } catch (error) {
      console.error(error);
      toast.error("Error filtering products");
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) getProducts();
    else loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length && !checkedRadio.length) getProducts();
    else getFilteredProduct();
  }, [checked, checkedRadio]);

  return (
    <Layout title="All Products - Best Offers">
      <div className="container-fluid py-4">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-md-3 mb-4">
            <div className="bg-light p-3 rounded shadow-sm">
              <h5 className="text-center">Filter By Category</h5>
              <div className="mb-3 d-flex flex-column ">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
              <h5 className="text-center mt-3">Filter By Prices</h5>
              <Radio.Group
                className="d-flex flex-column"
                onChange={(e) => setCheckedRadio(e.target.value)}
              >
                {Prices?.map((p) => (
                  <Radio key={p.name} value={p.array}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>
              <div className="mt-3 text-center">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => window.location.reload()}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-md-9">
            <h3 className="text-center mb-4">All Products</h3>
            <div className="row g-4">
              {Array.isArray(products) &&
                products
                  .filter((product) => product && product._id)
                  .map((product) => (
                    <div key={product._id} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={`/api/v1/product/product-photo/${product._id}`}
                          className="card-img-top object-fit-cover"
                          alt={product.name}
                          style={{ height: "250px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text text-truncate">
                            {product.description}
                          </p>
                          <p className="fw-bold">Price: ${product.price}</p>
                          <div className="mt-auto">
                            <div className="d-grid gap-2">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  navigate(`/product/${product.slug}`)
                                }
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

            {/* Load More Button */}
            <div className="text-center my-4">
              {!checked.length &&
                !checkedRadio.length &&
                products.length < total && (
                  <button
                    className="btn btn-warning px-4"
                    onClick={() => setPage(page + 1)}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
