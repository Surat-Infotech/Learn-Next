import { FC, useState, useEffect } from 'react';

const CheckOutFooter: FC = () => {
  const [year, setYear] = useState<number>(0);
  useEffect(() => {
    const GetYear = new Date().getFullYear();
    setYear(GetYear);
  }, []);
  return (
    <p className="checkOut-footer-text">© Loose Grown Diamond {year}. All Rights Reserved.</p>
  );
};

export default CheckOutFooter;
