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
  const [checkoutloading, setCheckoutLoading] = useState(false);
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
    setCheckoutLoading(true);
    console.log(token);

    if (!token) {
      navigateTo("/login");
      setCheckoutLoading(false);
      return;
    } else {
      //_setMessage(
      //  "Currently disabled buy the app to experience the full feature"
      //);
      try {
        const formData = new FormData(ev.target);

        const response = await axiosClient.post("/checkout/", formData);

        // Get the redirect URL from the response data

        // Set the redirect URL in state
        setRedirectUrl(response.data);
        setCheckoutLoading(false);
      } catch (err) {
        console.log(err);
        _setMessage("Failed");
        setCheckoutLoading(false);
      }
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
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="background_bluish mx-auto mt-16 max-w-2xl rounded-3xl  ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none"
                >
                  <div className="p-8 sm:p-10 lg:flex-auto">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-50">
                      {plan.name}
                    </h3>
                    <p className="mt-6 text-base leading-7 text-gray-50">
                      {plan.description}{" "}
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
                      {plan.features.map((feature, index) => (
                        <li className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature.description}
                        </li>
                      ))}
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
                            ${plan.monthlyprice}
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
                            value={plan.id}
                          />
                          {!checkoutloading && (
                            <button
                              id="checkout-and-portal-button"
                              type="submit"
                              className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Subscribe
                            </button>
                          )}
                          {checkoutloading && (
                            <button
                              disabled
                              type="button"
                              class="group mt-10 relative flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <svg
                                aria-hidden="true"
                                role="status"
                                class="inline w-4 h-4 mr-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="#E5E7EB"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentColor"
                                />
                              </svg>
                              Loading...
                            </button>
                          )}
                        </form>
                        <p className="mt-6 text-xs leading-5 text-gray-600">
                          Invoices and receipts available for easy company
                          reimbursement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {message && (
            <div
              id="toast-warning"
              class="fixed flex items-center top-20 w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow  left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
              role="alert"
            >
              <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Warning icon</span>
              </div>
              <div class="ml-3 text-sm font-normal">{message}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
