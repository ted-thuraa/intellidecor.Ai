import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";

export default function PlansForm(props) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [plan, setPlan] = useState({
    id: null,
    name: "",
    description: "",
    monthlyprice: "",
    yearlyprice: "",
    stripePlanId: "",
    status: "",
    created_at: "",
    features: [],
  });

  if (props.plan) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/admin/plans/${props.plan.id}`)
        .then(({ data }) => {
          setLoading(false);
          setPlan(data.data);
          console.log(data);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, []);
  }

  const handleFeatureChange = (index, ev) => {
    const newFeature = [...plan.features];
    newFeature[index].description = ev.target.value;
    setPlan({ ...plan, features: newFeature });
  };
  const handleAddFeature = (ev) => {
    setPlan({
      ...plan,
      features: [...plan.features, { description: "" }],
    });
  };

  const initiateUntoggle = (ev) => {
    props.unToggleModal(ev);
  };

  console.log(plan);

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (plan.id) {
      console.log(plan);
      axiosClient
        .put(`/admin/plans/${plan.id}`, plan)
        .then(() => {
          initiateUntoggle();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            if (response.data.errors) {
              setErrors(response.data.errors);
            } else {
              setErrors({
                email: [response.data.message],
              });
            }
          }
        });
    } else {
      axiosClient
        .post("/admin/plans", plan)
        .then(() => {
          initiateUntoggle();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            if (response.data.errors) {
              setErrors(response.data.errors);
            } else {
              setErrors({
                email: [response.data.message],
              });
            }
          }
        });
    }
  };

  return (
    <div
      id="popup-modal"
      tabindex="-1"
      class="fixed flex top-0 left-0 right-0 z-50 bg-sky-700/50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-screen"
    >
      <div class="relative w-full h-full mx-60 md:h-auto">
        <div class="relative  bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            onClick={(ev) => initiateUntoggle(ev)}
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>

          <div class="p-8 text-start overflow-y-scroll overflow-x-hidden">
            <div className="mb-4 border-b-1 border-gray-300">
              {plan.id && (
                <h3 class="text-xl pb-2 font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
              )}
              {!plan.id && (
                <h3 class="text-xl pb-2 font-bold text-gray-900 dark:text-white">
                  New plan
                </h3>
              )}
            </div>
            {errors && (
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                {Object.keys(errors).map((key) => (
                  <span key={key} class="block sm:inline">
                    {errors[key][0]}
                  </span>
                ))}
                <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <svg
                    class="fill-current h-6 w-6 text-red-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
                </span>
              </div>
            )}
            <div className="mt-5  md:col-span-2 md:mt-0 ">
              {!loading && (
                <form onSubmit={onSubmit}>
                  <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="bg-white px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Name
                          </label>
                          <input
                            onChange={(ev) =>
                              setPlan({
                                ...plan,
                                name: ev.target.value,
                              })
                            }
                            value={plan.name}
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="email-address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Description
                          </label>
                          <textarea
                            onChange={(ev) =>
                              setPlan({
                                ...plan,
                                description: ev.target.value,
                              })
                            }
                            value={plan.description}
                            type="text"
                            name="email-address"
                            id="email-address"
                            autoComplete="email"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          ></textarea>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Status
                          </label>
                          <select
                            onChange={(ev) =>
                              setPlan({
                                ...plan,
                                status: ev.target.value,
                              })
                            }
                            value={plan.status}
                            id="country"
                            name="country"
                            autoComplete="country-name"
                            className="mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option>Active</option>
                            <option>Draft</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Stripe ProductId
                          </label>
                          <input
                            onChange={(ev) =>
                              setPlan({
                                ...plan,
                                stripePlanId: ev.target.value,
                              })
                            }
                            value={plan.stripePlanId}
                            type="text"
                            name="postal-code"
                            id="postal-code"
                            autoComplete="Phone"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Monthly Price
                          </label>
                          <input
                            onChange={(ev) =>
                              setPlan({
                                ...plan,
                                monthlyprice: ev.target.value,
                              })
                            }
                            type="text"
                            value={plan.monthlyprice}
                            name="postal-code"
                            id="postal-code"
                            autoComplete="password"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Yearly Price
                          </label>
                          <input
                            onChange={(ev) =>
                              setPlan({
                                ...plan,
                                yearlyprice: ev.target.value,
                              })
                            }
                            type="text"
                            value={plan.yearlyprice}
                            name="yearlyprice"
                            id="yearlyprice"
                            autoComplete="yearly price"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="col-span-6 sm:col-span-4 lg:col-span-4"
                          >
                            <label
                              htmlFor="postal-code"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Feature
                            </label>
                            <input
                              onChange={(ev) =>
                                handleFeatureChange(featureIndex, ev)
                              }
                              type="text"
                              value={feature.description}
                              name="features"
                              id="features"
                              autoComplete="features"
                              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        ))}
                        <buttton
                          onClick={(ev) => handleAddFeature(ev)}
                          className="cursor-pointer"
                        >
                          add feature
                        </buttton>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
