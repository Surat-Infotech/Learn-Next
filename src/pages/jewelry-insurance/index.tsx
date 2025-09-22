import React from 'react'
import Image from 'next/image';

import JewelLogo from 'src/assets/image/jewel-logo.webp'

const JewelryInsurance = () => (
    <>
        <div className='jewelry-insurance-banner'>
            <div className='container-fluid'>
                <div className='row align-items-center row-gap-40'>
                    <div className='col-md-6'>
                        <div className='text-center text-md-start'>
                            <h1>Peace of mind for your jewelry</h1>
                            <button type="button" className='common_btn'>GET A QUOTE</button>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <Image src={JewelLogo} alt="jewel-logo" className='d-block mx-auto' />
                    </div>
                </div>
            </div>
        </div>

        <div className='mx-780'>
            <div className='text-center'>
                <h2>Get your free quote today</h2>
                <div className='mb-35'>
                    <p>Loose Grown Diamond has collaborated with Jewelers Mutual, the leader in jewelry insurance, to remind you of the importance of protecting your beautiful and timeless jewelry from loss, theft, damage and even disappearance.</p>
                    <p>Whether {`it's `}an engagement ring or a gift to yourself, protecting your jewelry is quick, easy and allows you to wear without worry. A policy from Jewelers Mutual typically costs 1-2% of the{` jewelry's`} value per year and checking how much it will cost you takes less than a minute.</p>
                </div>
                <button type="button" className='common_btn'>GET A QUOTE</button>
            </div>
        </div>

        <div className='bg_light_blue'>
            <div className='mx-780 text-center'>
                <h2>Jewelers Mutual personal jewelry insurance advantages include:</h2>
                <ul className='mb-35'>
                    <li>Comprehensive worldwide coverage while traveling that extends beyond ordinary homeowners insurance</li>
                    <li>Protection against theft, damage, accidental loss, and disappearance</li>
                    <li>The option to choose your own jeweler</li>
                    <li>Repair of damaged jewelry with the same level of quality as the original</li>
                    <li>Replacement of lost jewelry with the same brand and type</li>
                    <li>Graduate Gemologists (GIA) with a passion for jewelry on staff</li>
                </ul>
                <button type="button" className='common_btn mb-35'>GET A QUOTE</button>
                <p className='mb-0'>If you have any questions about jewelry insurance from Jewelers Mutual, please email <b>personaljewelry@jminsure.com</b> or call <b>+1 888-884-2424.</b>
                </p>
            </div>
        </div>

        <div className='mx-780 text-center'>
            <h2>About Jewelers Mutual</h2>
            <p>{`For over 100 years, Jewelers Mutual has been offering protection from loss, damage, theft and even disappearance. Your most prized jewelry possessions don't simply reflect light, they are reflections of you and of life's most important moments. When you're covered by Jewelers Mutual, you have the ability to wear your jewelry without apprehension.`}</p>
        </div>

        <div className='bg_light_blue'>
            <div className='mx-780'>
                <p className='mb-2'>Jewelers Mutual® Group has provided the content on this page.</p>
                <p className='mb-2'>*Insurance coverage only available in the United States (all 50 states and the District of Columbia) and Canada (excluding Quebec).</p>
                <p className='mb-2'>Must be at least 18 years of age to apply for insurance. Although Loose Grown Diamond may offer opinions to consumers about the importance of protecting their purchases, Loose Grown Diamond is not a licensed agent and does not sell or offer advice about insurance. Any/all decisions for protecting jewelry must be made by the consumer, following information gathering. The purchase of insurance must be done by direct interaction with an insurer or licensed insurance agent.</p>
                <p className='mb-2'>Coverage is subject to the provisions, limitations, exclusions, and endorsements in the policy and the level of coverage you select. Coverage is offered by either Jewelers Mutual Insurance Company, SI (a stock insurer) or JM Specialty Insurance Company. Policyholders of both insurers are members of Jewelers Mutual Holding Company. Any coverage is subject to acceptance by the insurer and to policy terms and conditions.</p>
            </div>
        </div>
    </>
)

export default JewelryInsurance
