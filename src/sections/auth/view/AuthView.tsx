import { FC } from 'react';

import RegisterForm from '../RegisterForm';

// ----------------------------------------------------------------------

const AuthView: FC = () => (
  <>
    <div className="top_bar">
      <div className="container-fluid">
        <ul>
          <li>Insured Shipping with 7 days Free Returns*</li>
        </ul>
      </div>
    </div>
    <div className="Auth-back ">
      <RegisterForm />
      <div className="footer">
        <p className="text-center mb-0 fs-12">© Loose Grown Diamond {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </div>
  </>
);

export default AuthView;
