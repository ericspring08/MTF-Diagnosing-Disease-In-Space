import React from 'react';
import Link from 'next/link';

const HomePage = () => {
     return (
          <div
               className="h-screen flex flex-col justify-center items-center"
               data-theme="corporate"
          >
               <div className="lg:text-8xl md:text-5xl sm:text-5xl text-5xl p-10 text-center">
                    Smart Disease Diagnosis
               </div>
               <Link href="/cardio" className="btn btn-error m-2">
                    Cardiovascular
               </Link>
               <Link href="/resp" className="btn btn-info m-2">
                    Respiratory
               </Link>
          </div>
     );
};

export default HomePage;
