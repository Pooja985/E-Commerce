import React from "react";
import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy & Policy"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/privacy-policy.jpeg"
            alt="privacy policy"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h3>Privacy Policy</h3>
          <p>
            We are committed to protecting your personal information and your
            right to privacy. When you use our ecommerce platform, we collect
            only the information necessary to process your order and improve
            your experience.
          </p>
          <p>
            All personal details such as your name, email, address, and phone
            number are kept confidential and are never shared with third parties
            without your consent.
          </p>
          <p>
            We use secure payment gateways to ensure your transactions are safe
            and encrypted. We do not store your payment details.
          </p>
          <p>
            Our website may use cookies to enhance user experience and analyze
            site traffic, but you can control cookie preferences from your
            browser settings.
          </p>
          <p>
            By using our services, you agree to the terms outlined in this
            Privacy Policy. We may update this policy from time to time and will
            notify users of any significant changes.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
