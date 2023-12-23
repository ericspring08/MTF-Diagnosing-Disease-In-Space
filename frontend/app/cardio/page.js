'use client'
import React, {useState, useEffect} from 'react';
import BasicsForm from './BasicsForm';
import EKGForm from './EKGForm';
import BloodWork from './BloodWorkForm';

const BloodWorkPage = () => {
    const forms = [<BasicsForm key="basics"/>, <BloodWork key="bloodwork"/>, <EKGForm key="ekg"/>]
    const [formIndex, setFormIndex] = useState(0)

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-950">
            <div className="bg-white p-8 rounded-md shadow-md dark:bg-black">
                <h1 className="text-2xl font-semibold mb-6">Cardiovascular Disease Risk Calculator</h1>
                {forms[formIndex] || null}
                <div className="flex">
                    {
                        formIndex === 0 ? null : <button
                            onClick={() => setFormIndex(formIndex - 1)}
                            className="btn">
                            Previous
                        </button>
                    }
                    {
                        formIndex === forms.length - 1 ? <button
                            onClick={() => alert('You have completed the form!')}
                            className="btn">
                            Submit
                        </button> : null
                    }
                    {
                        formIndex === forms.length - 1 ? null : <button
                            onClick={() => setFormIndex(formIndex + 1)}
                            className="btn">
                            Next
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default BloodWorkPage;