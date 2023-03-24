import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Pricing() {
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
    <>
      {!loading && (
        <section class=" dark:bg-gray-900">
          <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto md:mt-12 max-w-screen-md text-center mb-8 lg:mb-12">
              <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-white dark:text-white">
                Designed for Creatives like you
              </h2>
              <p class="mb-5 font-light text-white sm:text-xl dark:text-gray-400">
                Here at Intellidecor we focus on giving creatives like you,
                tools to unlock creativity potential.
              </p>
            </div>
            <div class="md:mt-16 space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
              {plans.map((plan) => (
                <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 background_bluish rounded-lg   dark:bg-gray-800 dark:text-white">
                  <h3 class="mb-4 text-gray-100 text-2xl font-semibold">
                    {plan.name}
                  </h3>
                  <p class="font-light text-gray-100 sm:text-lg dark:text-gray-400">
                    {plan.description}
                  </p>
                  <div class="flex justify-center items-baseline my-8">
                    <span class="mr-2 text-5xl text-gray-100 font-extrabold">
                      ${plan.monthlyprice}
                    </span>
                    <span class="text-gray-400 dark:text-gray-400">/month</span>
                  </div>

                  <ul role="list" class="min-h-card mb-8 space-y-4 text-left">
                    {plan.features.map((feature) => (
                      <li class="flex items-center text-gray-100 space-x-3">
                        <svg
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span>{feature.description}</span>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={onSubmit}>
                    {/* Add a hidden field with the lookup_key of your Price */}
                    <input
                      id="plan-id"
                      type="hidden"
                      name="plan-id"
                      value={plan.id}
                    />
                    <button
                      id="checkout-and-portal-button"
                      type="submit"
                      className="text-black bg-white hover:bg-slate-200 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                    >
                      Subscribe
                    </button>
                  </form>
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
        </section>
      )}
    </>
  );
}
