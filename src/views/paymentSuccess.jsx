import React, { useEffect, useParams } from "react";

export default function PaymentSuccess() {
    return (
        <>
            <main className="grid h-screen place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
                <div className="text-center">
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Congratulations Your payment was made successfully
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                        Time to explore your creativty
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Start designing
                        </a>
                        <a
                            href="#"
                            className="text-sm font-semibold text-gray-900"
                        >
                            Contact support{" "}
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
