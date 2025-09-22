export const paths = {

  // HOME
  home: {
    root: '/',
  },
  // WHOLESALE
  wholesale: {
    root: 'https://wholesale.loosegrowndiamond.com/',
  },
  // INVENTORY
  whiteDiamondInventory: {
    root: '/inventory',
  },

  // LAB CREATED DIAMONDS
  colorDiamondInventory: {
    root: '/lab-created-colored-diamonds',
  },

  // FINE JEWELRY
  fineJewelry: {
    root: '/fine-jewelry',
  },

  // LAB GROWN DIAMONDS
  labGrownDiamonds: {
    root: '/lab-grown-diamonds',
  },

  // COLLECTIONS
  collections: {
    root: '/collections',
    details: (slug: string) => `/collections/${slug}`,
  },

  // PRODUCT CATEGORY
  productCategory: {
    root: '/product-category',
    details: (slug: string) => `/${slug}`,
    // SUB-CATEGORY
    subCategory: {
      root: (categoryId: string, slug: string) => `/${categoryId}/${slug}`,
      details: (categoryId: string, subCategoryId: string, slug: string) =>
        `/${categoryId}/${subCategoryId}/${slug}`,
    },
  },

  // BESPOKE DIAMOND
  bespoke: {
    root: '/lab-created-diamond-ring',
  },
  // BUILD A RING
  buildRing: {
    root: '/build-a-ring',
  },

  // BUILD A RING
  buildDiamondToRing: {
    root: '/inventory?type=diamond-to-ring-builder',
  },

  // RING PREVIEW
  ringPreview: {
    root: '/ring-preview',
    details: (id: string) => `/ring-preview/${id}`,
  },

  // Trust Pilot
  trustPilot: {
    root: 'https://www.trustpilot.com/review/www.loosegrowndiamond.com',
  },

  // Trust Pilot
  instagram: {
    root: 'https://www.instagram.com/loosegrown_diamond/',
  },

  // Google Map
  googleMap: {
    root: 'https://www.google.com/maps/place/Loose+Grown+Diamond/@40.7578781,-73.9809134,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2596308781a8d:0x9a85e2f57c630ff8!8m2!3d40.7578781!4d-73.9809134!16s%2Fg%2F11ny2c5mz0?entry=ttu',
  },

  // DMCA Protrcted
  DMCAProtected: {
    root: 'https://www.dmca.com/Protection/Status.aspx?ID=383041cb-52c0-41ee-8411-1d717dd889f4&refurl=https://www.loosegrowndiamond.com/cart/',
  },

  // PRODUCT
  product: {
    root: '/product',
    details: (slug: string) => `/${slug}`,
  },

  // DIAMOND DETAIL
  diamondDetail: {
    details: (diamondType: string, diamondId: string) => `/diamond/${diamondType}/${diamondId}`,
  },

  // THANK YOU
  thankYou: {
    root: '/thank-you',
  },

  // READY TO SHIP
  readyToShip: {
    root: '/ready-to-ship',
  },

  // KLARNA
  klarna: {
    root: '/klarna',
  },

  // About Us

  aboutUs: {
    root: '/about-us',
  },

  // Blog

  blog: {
    root: '/blog',
    details: (category: string, slug: string) => `/blog/${category}/${slug}`,
  },

  // Comparison

  comparison: {
    root: '/comparison',
  },

  // Contact Us

  contactUs: {
    root: '/contact-us',
  },

  // Crypto-Payment

  cryptoPayment: {
    root: '/crypto-payment',
  },

  cryptoUSDTAddress: {
    root: 'TGHhWnoczXqbj9WttDu4AEUFEVVs2uFNR4',
  },

  // Diamond-Price-Match

  diamondPriceMatch: {
    root: '/diamond-price-match',
  },

  // Diamond-Size-Chart

  diamondSizeChart: {
    root: '/diamond-size-chart',
  },

  // FAQ

  faq: {
    root: '/faq',
  },

  // Feedback-Form

  feedbackForm: {
    root: '/feedback-form',
  },

  // Privacy-Policy

  privacyPolicy: {
    root: '/privacy-policy',
  },

  // Promo-code

  promoCode: {
    root: '/promo-code',
  },

  // Return-Policy

  returnPolicy: {
    root: '/return-policy',
  },

  // Shipping

  shipping: {
    root: '/shipping',
  },

  // term-of-use

  termOfUse: {
    root: '/term-of-use',
  },

  // Why-choose-us

  whyChooseUs: {
    root: '/why-choose-us',
  },

  meleeDiamonds: {
    root: '/product/lab-created-melee-diamond',
  },

  calibratedDiamonds: {
    root: '/product/round-shape-calibrated-diamonds',
  },

  fancyShapesDiamonds: {
    root: '/fancy-shape-diamonds',
    subCategory: {
      princessShape: {
        root: '/product/princess-shape-cvd-type-lla-diamonds',
      },
      cushionShape: {
        root: '/product/cushion-shape-lab-grown-hpht-diamonds',
      },
      heartShape: {
        root: '/product/heart-shape-lab-grown-hpht-diamonds',
      },
      marquiseShape: {
        root: '/product/marquise-shape-lab-grown-hpht-diamonds',
      },
      pearShape: {
        root: '/product/pear-shape-lab-grown-hpht-diamonds',
      },
      ovalShape: {
        root: '/product/oval-shape-lab-grown-hpht-diamonds',
      },
      emeraldShape: {
        root: '/product/emerald-shape-lab-grown-hpht-diamonds',
      },
      baguetteShape: {
        root: '/product/baguette-shape-lab-grown-hpht-diamond',
      },
      oldMineShape: {
        root: '/product/old-mine-cut-lab-grown-hpht-diamonds',
      },
      oldEuropeanShape: {
        root: '/product/old-european-cut-lab-grown-hpht-diamonds',
      },
      triangleShape: {
        root: '/product/triangle-shape-lab-grown-hpht-diamonds',
      },
      shieldShape: {
        root: '/product/shield-shape-lab-grown-hpht-diamonds',
      },
      hexagonShape: {
        root: '/product/hexagon-shape-lab-grown-hpht-diamonds',
      },
      trapezoidShape: {
        root: '/product/trapezoid-shape-lab-grown-hpht-diamonds',
      },
      tapperBaguetteShape: {
        root: '/product/tapper-baguette-shape-lab-grown-hpht-diamonds',
      },
    },
  },

  customeShapeDiamond: {
    root: '/custom-shape-diamonds',
  },

  diamondPriceCalculator: {
    root: '/diamond-price-calculator',
  },

  labcreatedDiamondRing: {
    root: 'lab-created-diamond-ring',
  },

  colorMeleeDiamonds: {
    root: '/color-melee-diamonds',
  },

  checkout: {
    root: '/checkout',
  },

  jewelryInsurance: {
    root: '/jewelry-insurance'
  },

  cart: {
    root: '/cart',
  },

  // PROFILE
  profile: {
    root: '/my-account',
  },

  // ORDER
  order: {
    root: '/my-account/orders',
    details: (orderNumber: number) => `/my-account/view-order/${orderNumber}`,
  },

  // LOST PASSWORD
  lostPassword: {
    root: '/my-account/lost-password',
  },

  // ORDER THANKYOU
  orderThankYou: {
    root: (orderId: string) => `/thankyou/order-received/${orderId}`,
  },

  // WISH LIST
  wishlist: {
    root: '/my-account/wishlist',
  },

  // ADDRESS
  address: {
    root: '/my-account/address',
    details: (id: string) => `/my-account/address/${id}`,
  },

  // ACCOUNT DETAILS
  account: {
    root: '/my-account/account',
  },

  // PASSWORD CHNAGE
  passwordChange: {
    root: '/my-account/password-change',
  },
  registerThankYou: {
    root: '/thank-you-for-registration',
  },
  // AUTH
  register: {
    root: '/register',
  },
  login: {
    root: '/login',
  },
  forgetPassword: {
    root: '/forgot-password',
  },
};
