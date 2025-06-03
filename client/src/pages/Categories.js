import React from "react";
import Layout from "../components/Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="container py-4">
        <h2 className="text-center mb-4">Browse Categories</h2>
        <div className="row">
          {categories?.map((c) => (
            <div className="col-md-4 mb-3" key={c._id}>
              <Link
                to={`/category/${c.slug}`}
                className="btn btn-outline-secondary w-100 py-4 fs-5"
              >
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
