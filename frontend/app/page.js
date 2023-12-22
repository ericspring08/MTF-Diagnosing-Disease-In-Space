import React from 'react';
import Link from 'next/link';

const HomePage = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="text-8xl p-10">Smart Diagnosis</div>
            <Link href="/cardio" className="m-10 p-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md focus:outline-none text-4xl font-semibold">
                Cardiovascular
            </Link>
            <Link href="/resp" className="m-10 p-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md focus:outline-none text-4xl font-semibold">
                Respiratory
            </Link>
        </div>
    );
};

export default HomePage;
