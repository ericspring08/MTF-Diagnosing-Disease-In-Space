'use client'
import React, {useState, useEffect} from 'react';
import BasicsForm from './BasicsForm';
import EKGForm from './EKGForm';
import BloodWork from './BloodWorkForm';
import axios from 'axios';

const BloodWorkPage = () => {
    const forms = [<BasicsForm key="basics"/>, <BloodWork key="bloodwork"/>, <EKGForm key="ekg"/>]
    const [formIndex, setFormIndex] = useState(0)
    const [formData, setFormData] = useState({
        'age': '',
        'sex': '',
        'cp': '',
        'trestbps': '',
        'chol': '',
        'fbs': '',
        'restecg': '',
        'thalach': '',
        'exang': '',
        'oldpeak': '',
        'slope': '',
        'ca': '',
        'thal': ''
    })

    const ConditionalForm = () => {
        switch (formIndex) {
            case 0:
                return <BasicsForm formData={formData} setFormData={setFormData}/>
            case 1:
                return <BloodWork formData={formData} setFormData={setFormData}/>
            case 2:
                return <EKGForm formData={formData} setFormData={setFormData}/>
            default:
                return <BasicsForm formData={formData} setFormData={setFormData}/>
        }
    }
    const Buttons = () => {
        if (formIndex === 0) {
            return (
                <button
                    onClick={() => setFormIndex(formIndex + 1)}
                    className="btn">
                    Next
                </button>
            )
        } else if (formIndex === forms.length - 1) {
            return (
                <div>
                    <button
                        onClick={() => setFormIndex(formIndex - 1)}
                        className="btn">
                        Previous
                    </button>
                    <button
                        onClick={() => submitData()}
                        className="btn">
                        Submit
                    </button>
                </div>
            )
        } else {
            return (
                <div className="flex">
                    <button
                        onClick={() => setFormIndex(formIndex - 1)}
                        className="btn">
                        Previous
                    </button>
                    <button
                        onClick={() => setFormIndex(formIndex + 1)}
                        className="btn">
                        Next
                    </button>
                </div>
            )
        }
    }

    const submitData = async () => {
        const res = await axios.post('https://nasahunchapi.onrender.com/hdd', formData)
        alert(res.data)
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-950">
            <div className="bg-white p-8 rounded-md shadow-md dark:bg-black">
                <h1 className="text-2xl font-semibold mb-6">Cardiovascular Disease Risk Calculator</h1>
                {ConditionalForm()}
                <div className="flex">
                    <Buttons/>
                </div>
            </div>
        </div>
    );
};

export default BloodWorkPage;