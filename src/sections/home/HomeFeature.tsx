import AsianAge from '@/assets/image/logo/asian_age.png';
import YahooNews from '@/assets/image/logo/yahoo_news.png';
import DigitalJournal from '@/assets/image/logo/digital_journal.png';
import DeccanChronicle from '@/assets/image/logo/deccan_chronicle.png';

import FeatureData from './Feature';

const FeatureArrayData = [
  {
    id: 1,
    img: {
      src: DigitalJournal,
      alt: 'digital_journal',
    },
  },
  {
    id: 2,
    img: {
      src: YahooNews,
      alt: 'yahoo_news',
    },
  },
  {
    id: 3,
    img: {
      src: DeccanChronicle,
      alt: 'deccan_chronicle',
    },
  },
  {
    id: 4,
    img: {
      src: AsianAge,
      alt: 'asian_age',
    },
  },
];
export default function HomePageFeatureSection() {
  return (
    <div className="section">
      <div className="container-fluid">
        <h4 className="text-center py_60 pt-0 mb-0">We have been featured in</h4>
        <div className="featured_img">
          {FeatureArrayData.map((featureData) => (
            <FeatureData key={featureData.id} {...featureData} />
          ))}
        </div>
      </div>
    </div>
  );
}
