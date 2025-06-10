import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommerce App"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/about.jpeg"
            alt="about us"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Welcome to our online bookstore! We are passionate about bringing a
            wide collection of books across genres like Fiction, Non-Fiction,
            Spiritual, Technology, and more right to your fingertips.
          </p>
          <p className="text-justify">
            Our goal is to make reading accessible and enjoyable for everyone.
            Whether you're a casual reader or a bookworm, you’ll find something
            that suits your interests. With an intuitive interface and secure
            checkout, we ensure a seamless shopping experience.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
