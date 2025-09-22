import React from 'react'

import MyAccontLoginForm from '../MyAccountLoginForm'
import MyAccountRegisterForm from '../MyAccountRegisterForm'

const MyAccountAuthView = () => (
    <div className='row px-1 px-lg-0'>
        <div className="col-lg-6">
            <MyAccontLoginForm />
        </div>
        <div className="col-lg-6">
            <MyAccountRegisterForm />
        </div>
    </div>
)

export default MyAccountAuthView
