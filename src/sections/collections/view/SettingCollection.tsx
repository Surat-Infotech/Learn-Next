import { ProductSubCategoryView } from "src/sections/product-category/view";

// ----------------------------------------------------------------------


interface SettingCollectionProps {
  heading: string;
  content: string;
}

const SettingCollection = ({ heading, content }: SettingCollectionProps) => {
  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Collections', isActive: true },
  ];
  return (
    <div>
      <ProductSubCategoryView
        heading={heading}
        content={content}
        enableRingBuilderForDiamondToRing={false}
        enableRingBuilder
        categorySlug='engagement-rings'
        productUrl={(slug) => `/engagement-rings/${slug}`}
        enableFilter
        breadcrumbs={breadcrumbs}
      />
    </div>
  )
}

export default SettingCollection
