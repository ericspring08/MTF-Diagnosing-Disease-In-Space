import React from 'react';

const Form = ({
  formStructure,
  formHeaders,
  formIndex,
  formData,
  setFormData,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (formHeaders.length === 0) {
    return <span className="loading loading-dots loading-xs"></span>;
  } else {
    return (
      <div className="max-w-lg mx-auto m-5" key={formIndex}>
        <h1 className="text-2xl font-semibold mb-4">
          {formHeaders[formIndex]}
        </h1>
        {Object.entries(formStructure[formHeaders[formIndex]]).map(
          ([key, value]) => {
            return (
              <div key={key} className="my-3">
                {value.type === 'numerical' ? (
                  <div>
                    <label
                      htmlFor={key}
                      className="label-text"
                    >
                      {value.title}
                    </label>
                    <input
                      type="number"
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${value.title}`}
                      className="input input-bordered w-full"
                    />
                  </div>
                ) : null}
                {value.type === 'categorical' ? (
                  <div>
                    <label
                      htmlFor={key}
                      className="label-text"
                    >
                      {value.title}
                    </label>
                    <select
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">
                        Please select{' '}
                        {value.title}
                      </option>
                      {Object.entries(
                        value.options,
                      ).map(
                        ([
                          optionname,
                          optionvalue,
                        ]) => {
                          return (
                            <option
                              value={
                                optionvalue
                              }
                              key={
                                optionname
                              }
                            >
                              {
                                optionname
                              }
                            </option>
                          );
                        },
                      )}
                    </select>
                  </div>
                ) : null}
              </div>
            );
          },
        )}
      </div>
    );
  }
};

export default Form;
