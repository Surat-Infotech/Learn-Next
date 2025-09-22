/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
    shape: yup.string().required('Shape is required'),
    carat: yup
        .number()
        .typeError('Carat must be a number')
        .positive('Carat must be greater than 0')
        .required('Carat is required'),
    color: yup.string().required('Color is required'),
    clarity: yup.string().required('Clarity is required'),
    laboratory: yup.string().required('Laboratory is required'),
    proportions: yup.string().required('Proportions are required'),
    discount: yup
        .number()
        .typeError('Discount must be a number')
        .min(0, 'Discount must be at least 0%')
        .max(100, 'Discount cannot exceed 100%')
        .required('Discount is required'),
});

const DiamondPriceCalculator = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            shape: '',
            carat: 1,
            color: '',
            clarity: '',
            laboratory: '',
            proportions: '',
            discount: 10,
        }
    });

    const onSubmit = (data: any) => {
        alert(`Coming soon...`);
    };

    return (
        <div className="container-fluid">
            <div className="diamond-price-banner text-center">
                <h2>Diamond Price Calculator</h2>
                <p>
                    To determine the price of a diamond depending on factors such as color, clarity,
                    carat, and more, use our diamond price calculator. To calculate your diamond value,
                    view a price history chart, and find comparable diamonds, choose the {`diamond's`}
                    shape, carat, color, clarity, and other details.
                </p>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="contact_us">
                        <div className="form_box p-0">
                            <div className="row row-gap-15">
                                {/* Shape */}
                                <div className="col-md-6">
                                    <div className="custom-form-select">
                                        <label className="diamond-price-label">
                                            Shape<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            {...register('shape')}
                                            className={`form-select ${errors.shape ? 'is-invalid' : ''
                                                }`}
                                        >
                                            <option value="">-- select --</option>
                                            <option value="Asscher">Asscher</option>
                                            <option value="Cushion">Cushion</option>
                                            <option value="Emerald">Emerald</option>
                                            <option value="Heart">Heart</option>
                                            <option value="Marquise">Marquise</option>
                                            <option value="Oval">Oval</option>
                                            <option value="Pear">Pear</option>
                                            <option value="Round">Round</option>
                                            <option value="Princess">Princess</option>
                                            <option value="Radiant">Radiant</option>
                                            <option value="Trillion">Trillion</option>
                                            <option value="Baguette">Baguette</option>
                                        </select>
                                        <div className="invalid-feedback">{errors.shape?.message}</div>
                                    </div>
                                </div>
                                {/* Carat */}
                                <div className="col-md-6">
                                    <label className="diamond-price-label">
                                        Carat<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        {...register('carat')}
                                        className={`form-control ${errors.carat ? 'is-invalid' : ''}`}
                                        min={0.01}
                                        step={0.01}
                                    />
                                    <div className="invalid-feedback">{errors.carat?.message}</div>
                                </div>
                                {/* Color */}
                                <div className="col-md-6">
                                    <div className="custom-form-select">
                                        <label className="diamond-price-label">
                                            Color<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            {...register('color')}
                                            className={`form-select ${errors.color ? 'is-invalid' : ''
                                                }`}
                                        >
                                            <option value="">-- select --</option>
                                            <option value="D">D</option>
                                            <option value="E">E</option>
                                            <option value="F">F</option>
                                            <option value="G">G</option>
                                            <option value="H">H</option>
                                            <option value="I">I</option>
                                            <option value="J">J</option>
                                            <option value="K">K</option>
                                            <option value="L">L</option>
                                            <option value="M">M</option>
                                        </select>
                                        <div className="invalid-feedback">{errors.color?.message}</div>
                                    </div>
                                </div>
                                {/* Clarity */}
                                <div className="col-md-6">
                                    <div className="custom-form-select">
                                        <label className="diamond-price-label">
                                            Clarity<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            {...register('clarity')}
                                            className={`form-select ${errors.clarity ? 'is-invalid' : ''
                                                }`}
                                        >
                                            <option value="">-- select --</option>
                                            <option value="FL">FL (Flawless)</option>
                                            <option value="IF">IF (Internally Flawless)</option>
                                            <option value="VVS1">VVS1</option>
                                            <option value="VVS2">VVS2</option>
                                            <option value="VS1">VS1</option>
                                            <option value="VS2">VS2</option>
                                            <option value="SI1">SI1</option>
                                            <option value="SI2">SI2</option>
                                            <option value="I1">I1</option>
                                            <option value="I2">I2</option>
                                            <option value="I3">I3</option>
                                        </select>
                                        <div className="invalid-feedback">{errors.clarity?.message}</div>
                                    </div>
                                </div>
                                {/* Laboratory */}
                                <div className="col-md-6">
                                    <div className="custom-form-select">
                                        <label className="diamond-price-label">
                                            Laboratory<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            {...register('laboratory')}
                                            className={`form-select ${errors.laboratory ? 'is-invalid' : ''
                                                }`}
                                        >
                                            <option value="">-- select --</option>
                                            <option value="AGS">AGS Lab</option>
                                            <option value="EGL USA">EGL USA</option>
                                            <option value="EGL Int'l">EGL {`Int'l`}</option>
                                            <option value="GIA">GIA Lab</option>
                                            <option value="HRD">HRD Lab</option>
                                            <option value="IGI">IGI Lab</option>
                                            <option value="None">None</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.laboratory?.message}
                                        </div>
                                    </div>
                                </div>
                                {/* Proportions */}
                                <div className="col-md-6">
                                    <div className="custom-form-select">
                                        <label className="diamond-price-label">
                                            Proportions<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            {...register('proportions')}
                                            className={`form-select ${errors.proportions ? 'is-invalid' : ''
                                                }`}
                                        >
                                            <option value="">-- select --</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Very Good">Very Good</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                            <option value="Poor">Poor</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.proportions?.message}
                                        </div>
                                    </div>
                                </div>
                                {/* Discount */}
                                <div className="col-md-6">
                                    <label className="diamond-price-label">
                                        Discount %<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        {...register('discount')}
                                        className={`form-control ${errors.discount ? 'is-invalid' : ''
                                            }`}
                                        min={0}
                                        max={100}
                                    />
                                    <div className="invalid-feedback">{errors.discount?.message}</div>
                                </div>
                                {/* Calculate Button */}
                                <div className="col-md-12">
                                    <button className="common_btn d-block ms-auto" type="submit">
                                        CALCULATE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <h2 className='heading-30 text-center mb-4'>How to Calculate Diamond Price or Value?- Diamond Price Calculator</h2>
            <h3 className="diamond-text-24 fw-400">Shape</h3>
            <p>Round and fancy forms including cushion, oval, emerald, princess, pear, Asscher radiant, marquise, and heart are among the many shapes available for diamonds.</p>
            <p>Carat Diamond size is measured in terms of weight, with 1 carat equal to 0.2 grams.</p>
            <p>Pick the{` diamond's`} carat (size). In the US, an engagement ring with a diamond weighs an average of 1.08 to 1.2 carats. The price estimate for a diamond increases with its size.</p>

            <h3 className="diamond-text-24 fw-400">Color</h3>
            <p>The GIA rates diamonds from D to z, with D standing for a flawlessly white diamond that has no color. Additionally, diamonds in the D to K color range are advised by several jewelers</p>
            <p>This applies to diamonds where colorlessness is desired, not to specially colored diamonds. We advise purchasing a diamond with a color of G or above.</p>

            <h3 className="diamond-text-24 fw-400">Clarity</h3>
            <p>A{` diamond's`} inclusions and flaws are measured using clarity grades. The majority of jewelers advise taking into account the FL–VS2 clear range.</p>
            <p>IF to I2 clarity, options are available in our diamond price estimator.</p>
            <p>For the highest clarity grades, a qualified grader would be needed to inspect the diamond under strong magnification to find flaws. When looking for diamonds, we advise starting with those that are rated VS2 and higher because they will have excellent clarity and flaws that are invisible to the unaided eye.</p>

            <h3 className="diamond-text-24 fw-400">Laboratory</h3>
            <p>The most renowned and well-known diamond grading company is GIA. Although AGS has less stringent requirements, it is also well-known that some jewelers send their products there to receive higher marks. You can choose from multiple laboratories in our diamond price calculator, including GIA, AGS, EGL, IGI, and HRD.</p>

            <h3 className="diamond-text-24 fw-400">Proportions</h3>
            <p>A new feature called “proportions” describes the diamond’s quality using the symbols Good, Very Good, Excellent, fair, and poor in our diamond price calculator. Which will assist you in making a decision.</p>
        </div>
    );
};

export default DiamondPriceCalculator;
