import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import Header from "../components/Header";
import Pricing from "../components/Pricing";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { CheckIcon } from "@heroicons/react/20/solid";

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
];

export default function Plans() {
  const { token } = useStateContext();
  const navigateTo = useNavigate();
  const [plans, setPlans] = useState();
  const [message, setMessage] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lookUpId, setLookUpId] = useState(null);

  const getPlans = () => {
    setLoading(true);
    axiosClient
      .get("/plans")
      .then(({ data }) => {
        console.log(data);
        setPlans(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPlans();
  }, []);
  console.log(plans);

  const _setMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    console.log(token);

    if (!token) {
      navigateTo("/login");
      return;
    } else {
      _setMessage(
        "Currently disabled buy the app to experience the full feature"
      );
      // const formData = new FormData(ev.target);

      //const response = await axiosClient.post("/checkout/", formData);

      // Get the redirect URL from the response data

      // Set the redirect URL in state
      //setRedirectUrl(response.data);
    }
  };

  console.log(redirectUrl);
  if (redirectUrl) {
    // Redirect the user to the Checkout redirect URL
    window.location.href = redirectUrl;
    return null;
  }

  return (
    <div className="like-root">
      {!loading && (
        <>
          <Header />
          <div className=" py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-50 sm:text-4xl">
                  Designed for Creatives like you
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-50">
                  Here at Intellidecor we focus on giving creatives like you,
                  tools to unlock creativity potential.
                </p>
              </div>

              <div className="background_bluish mx-auto mt-16 max-w-2xl rounded-3xl  ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-50">
                    IntelliDecor Ai pro
                  </h3>
                  <p className="mt-6 text-base leading-7 text-gray-50">
                    Best option for personal use & for your next project.
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-50 sm:grid-cols-2 sm:gap-6"
                  >
                    <li className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      Unlimited renders
                    </li>
                    <li className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      High quality renders
                    </li>
                    <li className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      Multiple styles to choose from
                    </li>
                    <li className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      Multiple rooms to select
                    </li>
                    <li className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      Download options
                    </li>
                  </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">
                        Special Price
                      </p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                          $20.00
                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          USD
                        </span>
                      </p>
                      <form onSubmit={onSubmit}>
                        {/* Add a hidden field with the lookup_key of your Price */}
                        <input
                          id="plan-id"
                          type="hidden"
                          name="plan-id"
                          value="2"
                        />
                        <button
                          id="checkout-and-portal-button"
                          type="submit"
                          className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Subscribe
                        </button>
                      </form>
                      <p className="mt-6 text-xs leading-5 text-gray-600">
                        Invoices and receipts available for easy company
                        reimbursement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
