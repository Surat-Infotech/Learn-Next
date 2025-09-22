// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// import { useLocalStorage } from 'usehooks-ts';

// import { paths } from '@/routes/paths';

// export const Faq = () => {
//   const [_totalWhiteDiamond] = useLocalStorage<number>('totalDiamond', 0);
//   const [formattedNumber, setFormattedNumber] = useState<string>('950k');

//   function formatNumberWithSuffix(num: number) {
//     // Convert the number to a proper format by rounding it
//     const a = Number(num);
//     const divisor = 10 ** (String(a).length - 2);
//     const rounded = Math.round(a / divisor) * divisor;

//     // Format the rounded number with suffixes
//     if (rounded >= 1_000_000) {
//       const millionValue = (rounded / 1_000_000).toFixed(1);
//       return millionValue.endsWith('.0') ? `${parseInt(millionValue, 10)}M` : `${millionValue}M`;
//     }
//     if (rounded >= 1_000) {
//       const thousandValue = (rounded / 1_000).toFixed(1);
//       return thousandValue.endsWith('.0') ? `${parseInt(thousandValue, 10)}k` : `${thousandValue}k`;
//     }
//     return rounded.toString();
//   }

//   useEffect(() => {
//     const formatted = formatNumberWithSuffix(_totalWhiteDiamond);
//     setFormattedNumber(formatted);
//   }, [_totalWhiteDiamond]);

//   const Diamond_JewelryFAQ = [
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How can you offer such low prices on all your diamonds/jewelry?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             {/* We proudly manufacture all our jewelry, and our loose diamonds come straight
//                       from our factory. We are direct manufacturer, there is no middlemen between us,
//                       so that we can offer you the best prices. We are confident that no diamond or
//                       jewelry retailer can compete with our quality and low prices. */}
//             We proudly manufacture all our jewelry, and Our loose diamonds come straight from our
//             factory through direct manufacturing, including partnerships with other manufacturers.
//             <div className="mt-2">
//               We are a group of direct manufacturers, there are no middlemen between us, so that we
//               can offer you the best prices. We are confident that no diamond or jewelry retailer
//               can compete with our quality and low prices.
//             </div>
//           </>
//         );
//       },
//       id: '1',
//     },
//     {
//       title() {
//         return <div className="d-flex align-items-center">Do you have a Low Price Guarantee?</div>;
//       },
//       answer() {
//         return (
//           <>
//             We offers the highest quality products at the lowest prices guaranteed. Shop with
//             confidence knowing that if you happen to find an item of identical size and quality at a
//             lower price, You just need to share the reference URL and we will beat the price.
//           </>
//         );
//       },
//       id: '2',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             I have found 2 same diamonds which are having same color, clarity, cut and size but the
//             price is difference? am I missing something?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             We have recently expanded our platform by partnering with additional manufacturers,
//             offering an extensive selection of over{' '}
//             {Number(_totalWhiteDiamond) > 0 ? formattedNumber : '950k'}+ Certified Lab Grown
//             Diamonds. Please be aware that there could be variations in pricing, as we do not
//             exercise control over diamond prices. Importantly, it’s worth highlighting that lower
//             prices do not impact the quality of the diamonds in any manner.
//           </>
//         );
//       },
//       id: '3',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             Are your lab grown diamonds Eco-friendly and Conflict Free?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             Yes, lab grown diamonds are eco-friendly and conflict free. This diamond is made in lab,
//             The reason being that these diamonds do not cause the same destruction and pollution &
//             conflicts as that caused by extracting natural diamonds.
//           </>
//         );
//       },
//       id: '4',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             I found the same diamond on other retailers website that I like. Can I buy it from you?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>Absolutely, Please share the reference URL of the website and we will beat the price.</>
//         );
//       },
//       id: '5',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How to search diamond using SKU?
//             <i className="fa-brands fa-youtube text-danger fs-3 ms-1" />
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <iframe
//             src="https://www.youtube.com/embed/KGOp8Pcj8zk?si=vK9BbRsiQyvoeauc"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           />
//         );
//       },
//       id: '6',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How often do you add diamonds to your inventory?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>We update our inventory with new products approximately every two-hour interval.</>
//         );
//       },
//       id: '7',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             If I buy a lab grown diamond, will anyone be able to tell?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             With the naked eye, no. It takes expensive equipment and specialized training to tell
//             the difference between the Natural and Lab Grown Diamond.
//           </>
//         );
//       },
//       id: '8',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How to find diamond using diamond filters?
//             <i className="fa-brands fa-youtube text-danger fs-3 ms-1" />
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <iframe
//             src="https://www.youtube.com/embed/hQGY4T98_5M?si=xAme8IRM8Y9eZDiC"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           />
//         );
//       },
//       id: '9',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How to watch 360 video of any diamond?
//             <i className="fa-brands fa-youtube text-danger fs-3 ms-1" />
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <iframe
//             src="https://www.youtube.com/embed/ps7l7Nhezh0?si=mLyx195v_qIYiawP"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           />
//         );
//       },
//       id: '10',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How can I design my own lab grown diamond ring?
//             <i className="fa-brands fa-youtube text-danger fs-3 ms-1" />
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <iframe
//             src="https://www.youtube.com/embed/SiFuLzZM-Rk?si=CzIEgKHAtHVoDruQ"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           />
//         );
//       },
//       id: '11',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How can I design my Custom Diamond Ring for free?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             We don’t charge for the CAD & 3D design of your custom design ring. Please click here to
//             submit your request. Do not forget to share the ring size, metal and the center stone.
//           </>
//         );
//       },
//       id: '12',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How to find fancy color lab diamonds?
//             <i className="fa-brands fa-youtube text-danger fs-3 ms-1" />
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <iframe
//             src="https://www.youtube.com/embed/gtI8X086erc?si=iqA9OL9mMpPah9Dk"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           />
//         );
//       },
//       id: '13',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             What if the diamond does not have the 360 video?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             {/* Do not hesitate, many time diamonds video are not uploaded. Just{' '}
//             <a href={paths.contactUs.root} target="_blank" rel="noreferrer">
//               contact us
//             </a>{' '}
//             and we will share you the 360 video/ live video of the diamond.PS: We rely on manufacturers for 360° live or tweezer videos of diamonds, which typically take 48 working hours to receive. However, the diamond may sell out during this time. We’ll do our best to obtain the video quickly, but we can’t guarantee its availability or quality. The video we provide is directly from the manufacturers, who may sometimes decline the request. */}
//             Do not hesitate, many time diamond video are not uploaded. Just{' '}
//             <a href={paths.contactUs.root} target="_blank" rel="noreferrer">
//               contact us
//             </a>{' '}
//             and we can try to share the 360 video/ live video of the diamond.PS: We rely on
//             manufacturers for 360° live or tweezer videos of diamonds, which typically take 48
//             working hours to receive. However, the diamond may sell out during this time. We’ll do
//             our best to obtain the video quickly, but we can’t guarantee its availability or
//             quality. The video we provide is directly from the manufacturers, who may sometimes
//             decline the request.
//           </>
//         );
//       },
//       id: '14',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             How can I make sure the diamonds I receive are actually the diamonds I ordered?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             When we ship a product to our customers we also provide them with an independent and
//             IGI/GIA/GCAL report to certify their quality and that you’ve received the exact product
//             you ordered. You can take our product to a local gemologist and compare them against all
//             of the properties mentioned in the report to cross verify the credibility of your
//             product.
//           </>
//         );
//       },
//       id: '15',
//     },
//     {
//       title() {
//         return <div className="d-flex align-items-center">Can I put a diamond on hold?</div>;
//       },
//       answer() {
//         return (
//           <>
//             We at Loose Grown Diamonds provide an option to customers of ‘holding a diamond’. In
//             this option a customer has to notify us that they are interested in a diamond but want
//             to confirm with friends/family/spouse as to whether they should purchase it or not. On
//             doing so, we hold the diamond for them only for up to 12 hours, so that they can make a
//             decision with ease. It works on
//             <b className="ms-1">first come first serve basis.</b>
//             <br />
//             <br />
//             PS: Placing a “hold on the diamond” is a request directed to the manufacturer for the
//             reservation of a specific diamond. We do not have control over inventory or the holding
//             process; it is entirely dependent on the manufacturer. If, for any reason, the diamond
//             that was placed on hold is sold out, we will provide you with the best alternative
//             diamond available, or you may opt for a refund.
//           </>
//         );
//       },
//       id: '16',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">How precise your calibrated diamonds are?</div>
//         );
//       },
//       answer() {
//         return <>Our Calibrated Diamonds are exhibit a variance of 0.01mm.</>;
//       },
//       id: '17',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             What is the crafting time for the Ring/Fine Jewelry?
//           </div>
//         );
//       },
//       answer() {
//         return <>Crafting takes up to 2 weeks for Ring/Fine Jewelry.</>;
//       },
//       id: '18',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             What is the typical crafting time for ring/jewelry with side stones?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             Crafting side stones in round shapes requires 3 to 4 days, whereas other shapes can
//             extend the ring/jewelry crafting time to 2 to 3 weeks, and the jewelry crafting time
//             will be extra.
//           </>
//         );
//       },
//       id: '19',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             What is the crafting time for the treated melee color diamonds?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             Crafting takes up to minimum of 2 to 4 weeks for Blue, Green, Pink, Purple and Yellow
//             color melee diamonds.
//           </>
//         );
//       },
//       id: '25',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             Can I see the CAD/3D look of my Ring/Jewelry?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             Yes, Once you placed the order, we will get back to you with the CAD/3D within 48
//             working hours over email.
//           </>
//         );
//       },
//       id: '20',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             Is there a fee for creating the CAD/3D design of my custom design request?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             There is no charge for the CAD/3D design of your custom request. We offer unlimited
//             revisions until you’re satisfied.
//             <b className="ms-1">
//               However, if you make more than one ring setting/changes, subsequent CAD & 3D designs
//               will incur a $20 fee each and that will be non refundable..
//             </b>
//           </>
//         );
//       },
//       id: '21',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             If I order a diamond and setting from Loose Grown Diamond, will it come as a complete
//             ring?
//           </div>
//         );
//       },
//       answer() {
//         return <>Yes! It will be shipped to you as a complete ring ready to wear.</>;
//       },
//       id: '22',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             Can I buy a setting without a diamond at Loose Grown Diamond?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             We do not sell any settings without the purchase of a center stone from Loose Grown
//             Diamond. Since all of our settings are handcrafted and made to order for each specific
//             center diamond, we want to ensure the highest quality of the finished piece.
//           </>
//         );
//       },
//       id: '23',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             Does your fine jewelry comes with the certificate?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             Our fine jewelry collection, which includes wedding rings, pendants, and earrings, does
//             not come with a certificate. We have intentionally chosen not to certify these pieces.
//             However, please rest assured that the diamonds used in our fine jewelry are of DEF color
//             and VVS/VS clarity, ensuring their exceptional quality and value. If you have any
//             further questions or concerns, please feel free to reach out. Your satisfaction is our
//             priority. If you want to certify it please let us know before placing an order and we
//             will share the cost upon request.
//           </>
//         );
//       },
//       id: '24',
//     },
//     {
//       title() {
//         return (
//           <div className="d-flex align-items-center">
//             Can I get a free appraisal for my purchase?
//           </div>
//         );
//       },
//       answer() {
//         return (
//           <>
//             Yes, you can. Please email us at support@loosegrowndiamond.com with your order number,
//             and our team will send you the digital appraisal at no cost. You can use it for
//             insurance purposes.
//           </>
//         );
//       },
//       id: '26',
//     },
//   ];

//   return { Diamond_JewelryFAQ };
// };

// export const ShippingFAQ = [
//   {
//     title: 'Do you Ship WORLDWIDE?',
//     answer() {
//       return (
//         <>
//           Yes, we do ship <strong> WORLDWIDE.</strong>
//         </>
//       );
//     },
//   },
//   {
//     title: 'When will my order ship?',
//     answer() {
//       return (
//         <>
//           <p>
//             Free Shipping: Orders typically
//             <strong> dispatch within 3 to 7 business days. </strong> (Orders up to $500 will incur a
//             shipping fee of $35 USD.)
//             <br />
//             Express Shipping($120): Orders typically
//             <strong> dispatch within 2 to 5 business days.</strong>
//             <br />
//             <br />
//             Diamonds marked with a truck icon are eligible for delivery within 3-5 working days.
//           </p>
//           <br />
//           <p>
//             <strong>
//               <i> Transit time is not included in the lead times stated above</i>{' '}
//             </strong>
//             because transit times vary so dramatically. The above timeframe doesn’t cover Jewelry
//             crafting.
//           </p>
//           <br />
//           <p>
//             If you need an order to ship by, or arrive by, an specific date we urge you to type in{' '}
//             <strong>“order notes”</strong> section provided during check out. We’ll do our best to
//             exceed your request or attempt to reach you and advise the best we can do.
//           </p>
//           <br />
//           Note: We do not shipped on Weekends & Holidays.{' '}
//           <strong>
//             (Kindly be aware that if the shipment is dispatched via DHL, it may experience extended
//             delivery times, as DHL operates on its unique system, which could potentially result in
//             delays of 3-7 working days within the EU.)
//           </strong>
//         </>
//       );
//     },
//   },
//   {
//     title: `Can I Get My Order Faster? I haven't paid for the Express Shipping`,
//     answer() {
//       return (
//         <>
//           Yes, Please email us on{' '}
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           – We will try our best to make it as fast as we can.
//         </>
//       );
//     },
//   },
//   {
//     title: 'What’s included in my order?',
//     answer() {
//       return (
//         <>
//           In the box, you will receive Diamond/Ring, Hard Copy of IGI/GIA certificate.
//           <br />
//           Note: Diamonds below 1 carat or cart total below $2,500 – The hard copy of IGI/GIA/GCAL
//           certificate will ship individually.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Are Your Shipments Fully Insured?',
//     answer() {
//       return <>Yes. All of our shipments are 100% insured.</>;
//     },
//   },
//   {
//     title: `I received my diamond but I didn't received the physical certificate Why?`,
//     answer() {
//       return (
//         <>
//           For all the orders below $2,500 cart total – The diamond certificate shipped with
//           individual shipment via USPS/UPS/FedEx/Aramex.
//         </>
//       );
//     },
//   },
//   {
//     title: 'How much time will it take to deliver it to my home?',
//     answer() {
//       return (
//         <>
//           Once it dispatched You will get the delivery within 5-8 business days. (Ring & Fine
//           Jewelry crafting time does not include in this timeframe.)
//         </>
//       );
//     },
//   },
//   {
//     title: 'What is the typical crafting time for ring/jewelry with side stones?',
//     answer() {
//       return (
//         <>
//           Crafting side stones in pear, marquise, or oval shapes requires 3 to 4 days, whereas other
//           shapes can extend the ring/jewelry crafting time to 2 to 3 weeks, and the jewelry crafting
//           time will be extra.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can I track my order online?',
//     answer() {
//       return (
//         <>
//           <p>
//             You can obtain the status of your current orders on the “Orders” under{' '}
//             <a
//               href="https://wholesale.loosegrowndiamond.com/profile/orders"
//               style={{ textDecoration: 'none', color: 'black', fontWeight: '600' }}
//             >
//               “My Account”
//             </a>{' '}
//             page.
//           </p>
//           <br />
//           Once dispatched you should be able to track your order on the shipping company’s website
//           using the tracking number we have given you.
//         </>
//       );
//     },
//   },
//   {
//     title:
//       'Are there any customs duties I have to pay? How much duty/taxes do I have to pay in custom?',
//     answer() {
//       return (
//         <>
//           <strong>
//             If you are from the United States you don’t need to pay any customs duties/fees.
//           </strong>
//           <p>
//             Other countries customers have to pay the duties and taxes. Once the package arrives in
//             your country, the courier will contact you to collect any taxes or duties. We don’t have
//             any exact figure of how much duty as it depends on the state/country government. Please
//             check your government website for the same. If you are from Europe, Please note that you
//             might need to pay the broker fees.
//           </p>
//           <br />
//           PS: Please be aware that we cannot guarantee making lower invoice.
//         </>
//       );
//     },
//   },
//   {
//     title:
//       'Do I have to pay customs duties on Loose Diamond Engagement Ring & Jewelry if I am from Canada?',
//     answer() {
//       return (
//         <>
//           <p>
//             Yes, you need to pay the customs duties/tax as per your country’s import rules which would be payable directly to the shipping company. <br />{' '}
//             <br />
//           </p>
//           PS: Please be aware that we cannot guarantee making lower invoice.
//         </>
//       );
//     },
//   },
//   {
//     title: `What do I do if my order doesn't arrive in the prescribed time frame?`,
//     answer() {
//       return (
//         <>
//           Email us on{' '}
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           OR Contact customer service at +1 646-288-0810  Monday to Friday from 9:00 AM to 5:00 PM
//           Eastern, and they would gladly help you track the package for you.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Im not going to be home when my package is supposed to arrive, what should I do?',
//     answer() {
//       return (
//         <>
//           Oftentimes we can set up a hold for pickup at an approved local FedEx location. Reach out
//           to a support representative in chat or email
//           <a
//             href="mailto:support@loosegrowndiamond.com"
//             className="text-decoration-none linkHover ms-1"
//           >
//             support@loosegrowndiamond.com
//           </a>{' '}
//           for help setting it up.
//         </>
//       );
//     },
//   },
//   // {
//   //   title: 'Do I have to pay customs, duties on Engagement Ring & Jewelry if I am from Canada?',
//   //   answer() {
//   //     return (
//   //       <>
//   //         With effect from July 1, 2020 the US-Mexico-Canada (USMCA) Trade Agreement exempted duties
//   //         on Engagement Ring & Jewelry made/assembled in the USA. There will be no duties for
//   //         jewelry that is made in the USA.
//   //       </>
//   //     );
//   //   },
//   // },
//   {
//     title: 'Can You Ship My Package To A FedEx Location To Be Held For Pick Up?',
//     answer() {
//       return (
//         <>
//           {/* Absolutely! You can have the package shipped to a FedEx Ship Center or a FedEx Print and
//           Ship to be Held for Pickup, where it can be held for up to 2 Business days. In case of
//           Pick Up, please email us at
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           with the nearest FedEx Pickup location. */}
//           Absolutely! You can have the package shipped to a FedEx Ship Center or Ship to be <br />{' '}
//           Held for Pickup, where it can be held for up to 2 Business days. In case of Pick Up,{' '}
//           <br /> please email us at{' '}
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           with the nearest FedEx Pickup location.
//           <br />
//           <br />
//           Please note that once the shipment has been dispatched, we are unable to reroute the
//           package. FedEx will attempt delivery a maximum of three times. If the package is returned
//           to us, we will reship it to you, but an additional fee of $50 will apply.
//         </>
//       );
//     },
//   },
//   {
//     title: 'What if my diamond/jewelry gets lost during shipment?',
//     answer() {
//       return (
//         <>
//           LGD takes every precaution to ensure that your order arrives safely. Your order is fully
//           insured during transit, and we require a signature for all packages. If its get lost you
//           will get full refund.
//         </>
//       );
//     },
//   },
//   {
//     title: `What's the claim process when shipment is lost?`,
//     answer() {
//       return (
//         <>
//           In such a scenario, we will be claiming the shipment, and once found, a new
//           diamond/product will be shipped back to you within 4 to 6 weeks. You must be patient and
//           cooperate with us to achieve the best results.
//         </>
//       );
//     },
//   },
// ];

// export const ReturnPolicyFAQ = [
//   {
//     title: 'Why is the return policy of Loose Grown Diamond only for 7-days?',
//     answer() {
//       return (
//         <>
//           <p>
//             As we are both diamond manufacturers and sellers it should be noted that we in no way
//             include any extra charges to our final prices, like ‘middle-men fee’. Something which is
//             commonly billed when purchasing from a diamond retailer. With a minimal profit margin we
//             are giving you the best quality diamonds as swiftly as we can, hence we keep a 7-day
//             return policy to ensure maximum efficiency for all our customers.
//           </p>
//           <br />
//           <p>
//             Many times 3-4 customers end up liking the same diamond/diamond jewelry, if we sell it
//             to someone and they want to return it within 7-days we are then able to sell that
//             diamond to another interested buyer. This helps us maintain the market balance.
//           </p>
//           <br />
//           <strong>Note: The 7 days start from the date of receiving the product.</strong>
//         </>
//       );
//     },
//   },
//   {
//     title: `What is LGD's Cancellation Policy?`,
//     answer() {
//       return (
//         <>
//           All Orders are eligible for cancellation when it is in packed/shipped status, as long as
//           the cancel option is available.
//         </>
//       );
//     },
//   },
//   {
//     title: 'I just cancelled my order. When will I receive my refund?',
//     answer() {
//       return (
//         <>
//           You will receive refund into the source account within 1-3 business days from the time of
//           order cancellation.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can I modify the shipping address of my order after it has been placed?',
//     answer() {
//       return (
//         <>
//           Yes, please
//           <strong className="ms-1">
//             <Link href="/contact-us" className="text-decoration-none linkHover">
//               contact us
//             </Link>
//           </strong>{' '}
//           to change your address.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can special/bespoke orders returned & eligible for refund?',
//     answer() {
//       return <>Yes, Special/bespoke orders can be returned & eligible for refund.</>;
//     },
//   },
//   {
//     title: ' When are returns not possible?',
//     answer() {
//       return (
//         <>
//           We cannot accept returns after return timeline has lapsed. Product must have in the same
//           condition (unused) along with the certificate.(if apply). We don’t accept the return for
//           round and fancy shapes melee & calibrated diamonds/melee fancy color diamond.
//         </>
//       );
//     },
//   },
//   {
//     title: 'How can I initiate a return?',
//     answer() {
//       return (
//         <>
//           You will have to send us an email on{' '}
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           along with the order number & the reason for your return. <br />
//           <strong>Note: Two items/returns/exchanges are allowed per customer, per year.</strong>
//         </>
//       );
//     },
//   },
//   {
//     title: 'What is the time-period within which I can return a product?',
//     answer() {
//       return (
//         <>
//           Products can be returned within 7 days of receiving the product. Post this, return is not
//           allowed.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Do I pay the return shipping costs?',
//     answer() {
//       return (
//         <>
//           We offer free returns for US customers. For international customers, we cover up to $50 in
//           return shipping costs within the 7-day return period. If the return shipping cost exceeds
//           $50, you are responsible for covering the additional amount.
//         </>
//       );
//     },
//   },
//   {
//     title: 'What is the pick-up process for the return of a product?',
//     answer() {
//       return (
//         <>
//           Once you’ve made a return request with us via email, our team will get back you with the
//           step by step process. <br />
//           <strong>Note: Two items/returns/exchanges are allowed per customer, per year.</strong>
//         </>
//       );
//     },
//   },
//   {
//     title: 'Why has my return request been rejected?',
//     answer() {
//       return (
//         <>It’s unfortunate, but the reason for making the return does not comply with our policy.</>
//       );
//     },
//   },
//   {
//     title: 'What is the mode of payment for refunds?',
//     answer() {
//       return (
//         <>All refunds are credited back to the account/card used to place the original order.</>
//       );
//     },
//   },
//   {
//     title: 'Why is the refund I received smaller than my original purchase amount?',
//     answer() {
//       return (
//         <>
//           Non-US residents may receive a lesser refund due to currency conversion fees. We’ve
//           processed a complete refund, which might encompass currency conversion charges imposed by
//           your bank. To obtain a refund receipt, please email us at
//           <a
//             href="mailto:support@loosegrowndiamond.com"
//             className="text-decoration-none linkHover ms-1"
//           >
//             support@loosegrowndiamond.com
//           </a>
//           . Additionally, consider contacting your bank to explore options for minimising these
//           charges, as they hold the primary authority and may be able to provide assistance. <br />{' '}
//           <br />
//           Please note that we are not responsible for any currency conversion charges that may have
//           been applied.
//         </>
//       );
//     },
//   },
//   {
//     title:
//       'Can I get a refund for the customs fees or any other taxes if I am returning the product?',
//     answer() {
//       return (
//         <>We are not responsible for any customs fees or other taxes in the case of a return.</>
//       );
//     },
//   },
//   {
//     title: 'How will I know that my refund has been initiated?',
//     answer() {
//       return (
//         <>
//           You’ll never have to ask. We’ll send you an email confirming the initiation of your
//           refund. Your refund should reach you within 1-3 working days.
//         </>
//       );
//     },
//   },
//   {
//     title: `I still haven't got my refund. Why?`,
//     answer() {
//       return (
//         <>
//           If we’ve sent you a confirmation on the approval of your refund, you will definitely get
//           your refund. However, in rare cases, we face technical difficulties that can delay refund
//           transfers. If the wait seems too long,
//           <strong className="mx-1">
//             <Link href="/contact-us" className="text-decoration-none linkHover">
//               contact us
//             </Link>
//           </strong>
//           us for support.
//         </>
//       );
//     },
//   },
// ];

// export const AboutUsFAQ = [
//   {
//     title: 'What is Loose Grown Diamond?',
//     answer() {
//       return (
//         <>
//           Loose Grown Diamond is a diamond manufacturing company which deals in the manufacturing
//           and selling of lab-grown diamonds/jewelry.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Why are the prices of our diamonds so affordable?',
//     answer() {
//       return (
//         <>
//           We don’t play tricks with our prices – they’re low because we do direct manufacturing
//           (including partnering with other manufacturers) and have a small, efficient team. You
//           won’t miss out on anything except the high prices! 😉💎
//         </>
//       );
//     },
//   },
//   {
//     title: 'Do you have a retail store located in my state?',
//     answer() {
//       return (
//         <>
//           Loose Grown Diamond has an office located in New York City. You would find our office on
//           fifth avenue, remember to book an appointment with us in advance, and we will be more than
//           happy to meet you.
//           <br />
//           <br />
//           <b>
//             At Loose Grown Diamond, we primarily operate online, allowing us to reduce operational
//             costs and focus our attention on manufacturing high-quality diamonds for you. By
//             concentrating on our service, we can offer our products at a much lower price than local
//             or other online jewelry stores.
//           </b>
//           <br />
//           <br />
//           We offer<b className="ms-1">FREE SHIPPING</b> on all items, and a
//           <b className="ms-1">7 days return policy.</b>
//         </>
//       );
//     },
//   },
//   {
//     title: 'Do you have gemologists on staff?',
//     answer() {
//       return (
//         <>
//           Absolutely, we currently employ graduates from the Gemological Institute of America. All
//           of the graduates are an essential part of our team. They help us in offering great
//           customer service. If our consumers have any sort of queries regarding our service or
//           product you can get in touch with our staff gemologists.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Where are the corporate office of Loose Grown Diamond located?',
//     answer() {
//       return (
//         <>
//           Our corporate office is located in New York city. You will find our office in the Diamond
//           District. The exact address of our office is listed below.
//           <br />
//           <br />
//           Loose Grown Diamond Corporate Office
//           <br />
//           55W 47th St., Suite #790
//           <br />
//           New York, NY-10036, USA
//         </>
//       );
//     },
//   },
// ];

// export const InsuranceCareFAQ = [
//   {
//     title: 'Do you clean or provide care for jewelry sold on your site?',
//     answer() {
//       return (
//         <>
//           NO, we do not provide cleaning services or external care for the Jewelry sold on our
//           website, the
//           <b className="ms-1">
//             reason behind this is that we already offer the lowest price possible on our product. We
//             do not include any middleman cost or extra margin on our product. Including any other
//             cost like cleaning would not be financially feasible for our business.
//           </b>
//           <br />
//           <br />
//           <br />
//           PS: Over time, it becomes necessary to tighten the prongs on all rings and occasionally
//           even replace them to prevent diamonds from becoming loose or falling out. It is strongly
//           recommended that all jewelry owners have their settings examined by a professional at
//           least once
//           <b className="ms-1">every 9-12 months.</b>
//         </>
//       );
//     },
//   },
//   {
//     title: 'What does your warranty cover?',
//     answer() {
//       return (
//         <>
//           Our warranty covers any issues with your product as soon as you receive it. It also
//           includes fixing loose prongs, polishing, and rhodium plating within a seven days of
//           purchase. We guarantee our products are defect-free, but if you find any issues, please
//           contact us.
//           <br />
//           <br />
//           If you have a different problem not covered by the warranty, contact us. We’ll inspect
//           your product and let you know the cost for our services.
//         </>
//       );
//     },
//   },
// ];

// export const Orders_RingSizesFAQ = [
//   {
//     title() {
//       return 'I saw a ring on your site, and I love it! Can I try it on?';
//     },
//     answer() {
//       return (
//         <>
//           We provide a money back guarantee. Once you receive the product, feel free to try it on
//           and see how it looks. We at Loose Grown Diamonds, have full faith in our products and
//           believe that you will absolutely love them after you receive them. In case you are not
//           satisfied with the product you can avail the
//           <b className="ms-1">money back guarantee and return our product within 7-days.</b>
//         </>
//       );
//     },
//     id: '1',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">
//           Can I order through your website?
//           <i className="fa-brands fa-youtube text-danger fs-3 ms-1" />
//         </div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           Yes absolutely you can order through our website. All the products which are displayed on
//           Loose Grown Diamond’s website are available for purchase (unless stated otherwise).
//           <br />
//           <br />
//           <iframe
//             src="https://www.youtube.com/embed/ONJW596CCfU?si=8wjXPBfAv3zeDPzd"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           />
//         </>
//       );
//     },
//     id: '2',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">Can I custom design an engagement ring?</div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           Yes absolutely, you can ask for your desired design and get in touch with us through our
//           website. We will be more than happy to design a customized engagement ring for you.
//         </>
//       );
//     },
//     id: '3',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">
//           Can I secure my diamond, If I am going with the custom setting route?{' '}
//         </div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           If you find a diamond you love, we urge you to purchase it and share your order number.
//           This will allow us to reserve the diamond while we process your CAD & 3D custom setting
//           request, which can take up to 2 days. Due to high demand, diamonds can sell out quickly,
//           so acting promptly ensures you secure your choice.
//         </>
//       );
//     },
//     id: '4',
//   },
//   {
//     title() {
//       return <div className="d-flex align-items-center">What if I need help placing an order?</div>;
//     },
//     answer() {
//       return (
//         <>
//           If you need any sort of assistance from us the number mentioned below is available 24
//           hours a day, 7 days a week. Customer service: 1-646-288-0810.
//         </>
//       );
//     },
//     id: '5',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">
//           What if I have a question about my order, want to change it, or need to cancel it?
//         </div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           For questions about your order, call Customer Service at{' '}
//           <a href="tel:+1 646-288-0810 ">+1 646-288-0810 </a>, 24 hours a day, 7 days a week, or send
//           an <a href="mailto:support@loosegrowndiamond.com">e-mail</a>.
//           <br />
//           <br />
//           You can check your order status online by clicking{' '}
//           <a href={paths.order.root} target="_blank" rel="noreferrer">
//             here
//           </a>
//           . You will need to login.
//         </>
//       );
//     },
//     id: '6',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">
//           Can I change the band width?
//         </div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           Yes, if you want to change the band width, we can do that for you. {`:) Up to 2mm, it's`} free. There is an <b className="fw-600">{`"Order Notes"`}</b> section on the checkout page where you can write down your instructions. If you want a band width above 2mm, {`it's`} an additional $100 up to 2.5mm and $200 for 3mm. For band widths above 3mm, please reach out via email at <a href="mailto:support@loosegrowndiamond.com">support@loosegrowndiamond.com</a> and we will provide you with a quote.
//         </>
//       );
//     },
//     id: '7',
//   },
//   // {
//   //     title() {
//   //         return (
//   //             <div className="d-flex align-items-center" >
//   //                 I am not from the USA, Do I have to pay customs duties/tax?
//   //             </div>
//   //         )
//   //     }, answer() {
//   //         return (
//   //             <>
//   //                 Yes, you need to pay the customs duties/tax as per your country’s import rules,
//   //                 <b className="ms-1" >
//   //                     If you are from the United States, India, Hong Kong , Australia or Dubai you
//   //                     don’t need to pay any customs duties/tax. Customers may incur a shipping
//   //                     handling charge of up to $30 for deliveries to Australia, which would be
//   //                     payable directly to the shipping company.
//   //                 </b>
//   //             </>
//   //         )
//   //     },
//   //     id: "7"
//   // },
//   {
//     title() {
//       return <div className="d-flex align-items-center">How do I get my ring size?</div>;
//     },
//     answer() {
//       return (
//         <>
//           Please{' '}
//           <a href="https://www.loosegrowndiamond.com/wp-content/uploads/2021/08/LGD-RING-SIZER.pdf">
//             click here
//           </a>{' '}
//           for a ring size chart option. OR We suggest you go to a local jewelry store and get your
//           exact ring size measured from there for 100% accuracy.
//         </>
//       );
//     },
//     id: '8',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">
//           How do I know what ring size to buy? What if I get the wrong size?
//         </div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           Please{' '}
//           <a
//             href="https://cdn.loosegrowndiamond.com/wp-content/uploads/2021/08/LGD-RING-SIZER.pdf"
//             target="_blank"
//             rel="noreferrer"
//           >
//             click here
//           </a>{' '}
//           for a ring size chart option. OR We suggest you go to a local jewelry store and get your
//           exact ring size measured from there for 100% accuracy.
//           <br />
//           <br />
//           No worries if you get it wrong though, We offer a 7 day free resize for all rings sold at
//           Loose Grown Diamond.
//           <b className="ms-1">
//             (Please note that Platinum ring can’t be resized and covered in this policy.)
//           </b>
//           Just reach out to a support via chat or email{' '}
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           to initiate a resize. Be sure to have your order number and correct size you need handy to
//           expedite the process.
//         </>
//       );
//     },
//     id: '9',
//   },
//   {
//     title() {
//       return <div className="d-flex align-items-center">Do you offer re-sizing?</div>;
//     },
//     answer() {
//       return (
//         <>
//           Yes, We offer a 7 day free resize for all rings sold at Loose Grown Diamond. Just reach
//           out to a support via chat or email{' '}
//           <a href="mailto:support@loosegrowndiamond.com" className="text-decoration-none linkHover">
//             support@loosegrowndiamond.com
//           </a>{' '}
//           to initiate a resize. Be sure to have your order number and correct size you need handy to
//           expedite the process.
//           <b className="ms-1">
//             Please note that Platinum ring can’t be resized and covered in this policy.
//           </b>
//         </>
//       );
//     },
//     id: '10',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">Can you engrave my ring/jewelry for Free?</div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           We provide free customization/personalization services and would be more than happy to
//           engrave a ring/jewelry for you. At the time of placing an order there is a
//           <b className="ms-1">“order notes”</b> section on the checkout page. Please write down the
//           instruction over there.
//         </>
//       );
//     },
//     id: '11',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">What fonts do you use for the Engraving?</div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           We have 2 types of fonts: 1) Normal 2) Cursive Writing. If you have any specific
//           requirement please{' '}
//           <a href={paths.contactUs.root} target="_blank" rel="noreferrer">
//             contact us
//           </a>
//           .
//         </>
//       );
//     },
//     id: '12',
//   },
//   {
//     title() {
//       return (
//         <div className="d-flex align-items-center">
//           Can you help keep the ring a surprise? Is {`LGD's`} packaging discreet?
//         </div>
//       );
//     },
//     answer() {
//       return (
//         <>
//           Yes, We can do that. Please write on the
//           <b className="ms-1">“order notes”</b> section for discreet packaging.
//         </>
//       );
//     },
//     id: '13',
//   },
//   // {
//   //     title() {
//   //         return (
//   //             <div className="d-flex align-items-center" >
//   //                 What if I need help placing an order?
//   //             </div>
//   //         )
//   //     }, answer() {
//   //         return (
//   //             <>
//   //                 If you need any sort of assistance from us the number mentioned below is
//   //                 available 24 hours a day, 7 days a week. Customer service: 1-646-288-0810.
//   //             </>
//   //         )
//   //     },
//   //     id: "14"
//   // },
//   {
//     title() {
//       return <div className="d-flex align-items-center">Are Your Prices in US Dollars?</div>;
//     },
//     answer() {
//       return <>Yes, our prices are in US Dollars.</>;
//     },
//     id: '15',
//   },
//   {
//     title() {
//       return <div className="d-flex align-items-center">Can I place my order by phone?</div>;
//     },
//     answer() {
//       return (
//         <>
//           Absolutely! If you would like to place your order over the phone you can speak with a
//           member of our Customer Service team by calling +1-646-288-0810.
//         </>
//       );
//     },
//     id: '16',
//   },
//   {
//     title() {
//       return <div className="d-flex align-items-center">Do you Price Match?</div>;
//     },
//     answer() {
//       return (
//         <>
//           Yes, We do Price Match, on top of that we can
//           <b className="ms-1">beat the price</b> 🙂 Please share the URL of the diamond/ring and we
//           will do price match OR beat the price. Please note price match on purchases can only be
//           made at the time of placing an order. We cannot honor any new promotions or discounts
//           after this timeframe.
//         </>
//       );
//     },
//     id: '17',
//   },
// ];

// export const Lab_Created_DiamondsFAQ = [
//   {
//     title: 'Are they the same as earth-created diamonds? If not, how are they different?',
//     answer() {
//       return (
//         <>
//           Lab-created diamonds and earth-created diamonds offer identical optical and chemical
//           composition. The sparkle is the same.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Will I still receive a physical laboratory certificate/grading report?',
//     answer() {
//       return (
//         <>
//           Yes – lab-created diamond will be accompanied by an independent laboratory (GIA/IGI/GCAL)
//           report detailing its “4 Cs” – cut, color, clarity, and carat weight. If your diamond is
//           mounted into jewelry, it will also be accompanied by an independent laboratory.
//           <br />
//           <br />
//           GIA graded lab grown diamonds have a digital copy of the grading report accessible on
//           their report website. If you purchase a GIA-graded lab-grown diamond, it will be laser
//           inscribed on the girdle and your receipt will show the report number for easy lookup and
//           printing.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Why some of the fancy shapes does not have the cut grade listed on the website?',
//     answer() {
//       return (
//         <>
//           Please note GIA, IGI and GCAL does not provide cut ratings for fancy cut stones, i.e any
//           shape outside of round. That’s why some of the fancy shapes does not have the cut grade
//           listed on the website.
//           <br />
//           <br />
//           Kindly take into consideration that the data for numerous diamonds is sourced from
//           different manufacturers, which can occasionally result in listing issues. We strongly
//           advise you to conduct a comprehensive review by carefully examining the certificate before
//           confirming your order. Should you encounter any problems either after placing the order or
//           upon delivery, please be aware that you have a 7-day window to initiate returns. Beyond
//           this period, we regret to inform you that we will not be able to assume responsibility for
//           any concerns or discrepancies related to your purchase.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Are all these listed diamonds are manufactured by Loose Grown Diamond?',
//     answer() {
//       return <>No, some of them are manufactured by our business partners.</>;
//     },
//   },
//   // {
//   //   title: 'Can I request for the tweezer/real video of the diamond in natural light?',
//   //   answer() {
//   //     return (
//   //       <>
//   //         Sure, we can send you the real video of the diamond in natural light using tweezers.
//   //         However, please note that we can only provide you with a maximum of two SKUs. Please let
//   //         us know the SKUs you are interested in.
//   //       </>
//   //     );
//   //   },
//   // },
//   {
//     title: 'Do you provide ASET image for the diamonds?',
//     answer() {
//       return <>No, We don’t provide the ASET image for the diamonds.</>;
//     },
//   },
//   {
//     title: 'Will the return policy be the same?',
//     answer() {
//       return (
//         <>
//           Yes! We stand behind all our products and want you to be 100% satisfied with your
//           purchase. You may return your diamond/jewelry piece for a full refund within 7 days. (the
//           7 days start from the date of receiving the product.)
//         </>
//       );
//     },
//   },
//   {
//     title: `I've received an email notifying me that the diamond I listed has an incorrect listing/price OR unavailable. What should I do in this situation?`,
//     answer() {
//       return (
//         <>
//           We’ve encountered instances where other manufacturers have listed items at incorrect
//           prices/listings multiple times or unavailable. Please be aware that we don’t have control
//           over these listings. Once we receive the order We’ll contact our vendors to secure your
//           diamond, which can take up to 24-48 business hours max since many of our vendors are
//           overseas. If the diamond is available, we will get it shipped to us. If it is no longer
//           available, we’ll send you an email with better options. you can either cover the price
//           difference /choose alternate diamond, or if you prefer, you’re welcome to cancel your
//           order and receive a full refund.
//         </>
//       );
//     },
//   },
// ];

// export const PaymentsFAQ = [
//   {
//     title: 'What types of payment do you accept?',
//     answer() {
//       return (
//         <>
//           <p>
//             We accept all major credit cards (Visa, MasterCard, American Express, and Discover),
//             Stripe, PayPal, Wire transfer, AftetrPay, Klarna, Splitit as well as Crypto.
//           </p>
//           <br />
//           <p>
//             Many customers purchasing items valued over $1,000 prefer paying by wire/wise transfer.
//             <strong className="ms-1">
//               Wire transfer/Crypto orders receive a 2% discount from our listed price.
//             </strong>
//             <br />
//             Customers paying by wire will receive wiring instructions once they have placed the
//             order. We must receive confirmation from our bank that a wire transfer has been
//             completed before items can be shipped.
//           </p>
//           <br />

//           <p>
//             If you have any questions, Please
//             <strong className="mx-1">
//               <Link href="/contact-us" className="text-decoration-none linkHover">
//                 contact us
//               </Link>
//             </strong>
//             for or <strong> call/WhatsApp us at +1 646-288-0810  </strong>
//           </p>
//           <br />

//           <p>
//             PS: If we didn’t received the order payment within 2 working business days, the order
//             will be cancelled due to non-payment & we are not responsible for the same.
//           </p>
//         </>
//       );
//     },
//   },
//   {
//     title: 'Will I receive a discount if I pay by bank wire?',
//     answer() {
//       return (
//         <>
//           Yes. Bank wire/wise.com customers receive a 2% discount off their entire order. Please
//           request coupon code from our support. <br />
//           PS: Please email the wire receipt to
//           <strong className="mx-1">
//             <a
//               href="mailto:support@loosegrowndiamond.com"
//               className="text-decoration-none linkHover"
//             >
//               support@loosegrowndiamond.com.
//             </a>
//           </strong>
//           Kindly note that we will begin processing your order only after receiving the full
//           payment.
//         </>
//       );
//     },
//   },
//   {
//     title: 'How to transfer a wire using my bank?',
//     answer() {
//       return (
//         <ul>
//           <li>
//             <b>T.D. Bank:</b> In the App, click “Send Money” and then “Transfers”
//           </li>
//           <li>
//             <b>U.S. Bank:</b>{' '}
//             <a
//               href="https://www.usbank.com/customer-service/knowledge-base/KB0069532.html"
//               target="_blank"
//               rel="noreferrer"
//             >
//               Step-by-step instructions
//             </a>
//           </li>
//           <li>
//             <b>Wells Fargo:</b>{' '}
//             <a
//               href="https://www.wellsfargo.com/online-banking/wires/"
//               target="_blank"
//               rel="noreferrer"
//             >
//               Log-in directions
//             </a>
//           </li>
//           <li>
//             <b>Bank of America: </b>{' '}
//             <a
//               href="https://resources.bankofamerica.com/direct/render-resource/9149a2de7b1047a499ae291815e985e6"
//               target="_blank"
//               rel="noreferrer"
//             >
//               How to send through Online Banking
//             </a>
//           </li>
//           <li>
//             <b>Capital One:</b>{' '}
//             <a
//               href="https://www.capitalone.com/help-center/checking-savings/send-receive-wire-transfer/"
//               target="_blank"
//               rel="noreferrer"
//             >
//               Step-by-step instructions
//             </a>
//           </li>
//           <li>
//             <b>Chase:</b>
//             <a href="https://www.youtube.com/watch?v=URcao5L4dPQ" target="_blank" rel="noreferrer">
//               {' '}
//               How to enroll for the first time and set up the wire recipient
//             </a>
//             ,{' '}
//             <a
//               href="https://www.youtube.com/watch?v=PTJpld3YvrU&t=83s"
//               target="_blank"
//               rel="noreferrer"
//             >
//               How to Send a Wire
//             </a>
//           </li>
//           <li>
//             <b>Citi:</b>{' '}
//             <a href="https://www.youtube.com/watch?v=R7u_TyV9eFk" target="_blank" rel="noreferrer">
//               App Instructions
//             </a>
//             ,{' '}
//             <a
//               href="https://online.citi.com/US/JRS/pands/detail.do?ID=WireTransfers"
//               target="_blank"
//               rel="noreferrer"
//             >
//               More Info
//             </a>
//           </li>
//         </ul>
//       );
//     },
//   },
//   // {
//   //   title: 'Will I be charged sales tax on my order?',
//   //   answer() {
//   //     return (
//   //       <>
//   //         No, We don’t collects sales tax on orders that are shipped from our South Asia Locations.
//   //       </>
//   //     );
//   //   },
//   // },
//   {
//     title: 'Can I pay with two different credit cards?',
//     answer() {
//       return (
//         <>
//           Yes. If you’d like pay with two different cards, please place your order over the phone
//           with customer service at +1 646-288-0810 . We are available 24 hours a day, 7 days a week.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Do you offer Financing/EMI?',
//     answer() {
//       return <>Yes. we do offer a EMI/finance with Splitit, AfterPay and Klarna.</>;
//     },
//   },
//   {
//     title: 'Why was my purchase not approved with Klarna?',
//     answer() {
//       return (
//         <>
//           Please refer to this article:
//           <Link
//             target="_blank"
//             className="mx-1 text-black text-decoration-none linkHover"
//             href="https://www.klarna.com/us/customer-service/why-was-my-purchase-not-approved-with-klarna/"
//           >
//             https://www.klarna.com/us/customer-service/why-was-my-purchase-not-approved-with-klarna/
//           </Link>
//         </>
//       );
//     },
//   },
//   {
//     title:
//       'Hi I’m trying to place an order through Splitit but for some reason I can’t get it to work anymore! Why?',
//     answer() {
//       return (
//         <>
//           You need to have at least the whole value of your purchase available on your card as an
//           authorization (hold) is kept on the total amount outstanding in order to guarantee future
//           payments to your merchant or retailer. Please refer to this article or contact Splitit:
//           <a
//             target="_blank"
//             className="ms-1"
//             href="https://www.splitit.com/faq/shoppers/"
//             rel="noreferrer"
//           >
//             https://www.splitit.com/faq/shoppers/
//           </a>
//         </>
//       );
//     },
//   },
//   {
//     title: 'How do I pay by ETH or BTC or USDT or Crypto?',
//     answer() {
//       return (
//         <>
//           You will be provided a unique link/QR Code to be able to pay with Bitcoin or Ethereum or
//           USDT or Crypto.
//         </>
//       );
//     },
//   },
// ];

// export const engagementRingsFAQS = [
//   {
//     title: 'How many carats should an engagement ring be?',
//     answer() {
//       return (
//         <>
//           The factors that highly matter while choosing the carat for an engagement ring are regions
//           and family traditions that are long pursued.
//           <br />
//           <br />
//           In some countries, it is primarily decided that the carat needs to be some distinctive
//           amount. Whereas, it is mostly seen and observed that 1.0 carat is the most commonly
//           prescribed and adorned lab grown diamond engagement ring as it is considered to be more
//           precious in comparison to a simple wedding band.
//           <br />
//           <br />
//           These days, people tend to adorn 1.25 and 1.50 carats to make their diamonds look bigger
//           whilst paying a reasonable price. Size is also determined by the shape of the diamond as
//           well because some shapes naturally look larger and more fascinating even if the carat is
//           less than usual.
//         </>
//       );
//     },
//   },
//   {
//     title: 'How much should I spend on the engagement ring?',
//     answer() {
//       return (
//         <>
//           Although there is no precise average spending for the engagement ring as it highly depends
//           from person to person, people tend to spend at least more than on the wedding ring,
//           ranging from $7000- $7500.
//           <br />
//           <br />
//           Simply, wedding rings are bands but the engagement ring has more value in the sense of
//           symbolism as well as worth of it. An engagement ring is a proposal ring that forms an
//           impression of joining a relationship of eternity that has high worth in itself and for its
//           definite value, one needs to find a ring that is worth the sentiments and price.
//           <br />
//           <br />
//           It also depends on the choice of metal and diamonds that are preferred by the couple, this
//           could make a very big difference in the costs.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Is it better to buy an engagement ring online?',
//     answer() {
//       return (
//         <>
//           Yes, it is better to buy it online as it costs 30-40% less than that in a physical store
//           while maintaining a high level of quality. Due to the whole process of selling and
//           distributing diamonds, physical delivery of diamonds from store to store costs,
//           miscellaneous charges, and taxes.
//           <br />
//           <br />
//           All ultimately add on to the price of a store diamond ring making them costlier than an
//           online diamond ring; which adds on no such charges. You can even get a better deal online
//           due to the huge inventory possessed by stores.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Which diamond shape is good for an engagement ring?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
// ];

// export const collectionPageFAQS = [
//   {
//     title: 'Can I change the band width?',
//     answer() {
//       return (
//         <>
//           The factors that highly matter while choosing the carat for an engagement ring are regions
//           and family traditions that are long pursued.
//           <br />
//           <br />
//           In some countries, it is primarily decided that the carat needs to be some distinctive
//           amount. Whereas, it is mostly seen and observed that 1.0 carat is the most commonly
//           prescribed and adorned lab grown diamond engagement ring as it is considered to be more
//           precious in comparison to a simple wedding band.
//           <br />
//           <br />
//           These days, people tend to adorn 1.25 and 1.50 carats to make their diamonds look bigger
//           whilst paying a reasonable price. Size is also determined by the shape of the diamond as
//           well because some shapes naturally look larger and more fascinating even if the carat is
//           less than usual.
//         </>
//       );
//     },
//   },
//   {
//     title: 'What does your warranty cover?',
//     answer() {
//       return (
//         <>
//           Although there is no precise average spending for the engagement ring as it highly depends
//           from person to person, people tend to spend at least more than on the wedding ring,
//           ranging from $7000- $7500.
//           <br />
//           <br />
//           Simply, wedding rings are bands but the engagement ring has more value in the sense of
//           symbolism as well as worth of it. An engagement ring is a proposal ring that forms an
//           impression of joining a relationship of eternity that has high worth in itself and for its
//           definite value, one needs to find a ring that is worth the sentiments and price.
//           <br />
//           <br />
//           It also depends on the choice of metal and diamonds that are preferred by the couple, this
//           could make a very big difference in the costs.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Does LGD create custom ring/jewelry?',
//     answer() {
//       return (
//         <>
//           Yes, it is better to buy it online as it costs 30-40% less than that in a physical store
//           while maintaining a high level of quality. Due to the whole process of selling and
//           distributing diamonds, physical delivery of diamonds from store to store costs,
//           miscellaneous charges, and taxes.
//           <br />
//           <br />
//           All ultimately add on to the price of a store diamond ring making them costlier than an
//           online diamond ring; which adds on no such charges. You can even get a better deal online
//           due to the huge inventory possessed by stores.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can I resize a ring ?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },

//   {
//     title: 'How should I get my finger sized?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can you engrave my ring/jewelry for Free?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
//   {
//     title: 'What is the typical crafting time for ring/jewelry with side stones?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can I place my order by phone?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
//   {
//     title: 'Can I have my item sooner than this?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
//   {
//     title: 'How can I design my own lab grown diamond ring?',
//     answer() {
//       return (
//         <>
//           The most habitual choice of people is the round-cut diamond when it comes to engagement
//           rings due to their brilliance and exceptional sparkle. It fits well with every person and
//           seems to be an eternal choice.
//           <br />
//           <br />
//           Choosing round-cut diamonds for the engagement ring can never go wrong for anyone because
//           it is considered to be universally accepted by people. In the end, it’s definitely the
//           choice of a person, however, and whatever they prefer to choose as their solitaire diamond
//           in an engagement ring.
//           <br />
//           <br />
//           It must be a choice that is the reflection of your sentiments and beliefs, that you want
//           to always keep with you till the end of time.
//         </>
//       );
//     },
//   },
// ];
