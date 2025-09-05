import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const storyIds = [1, 2, 3, 4, 5];

const MainCarousel: React.FC = () => {
  const { t } = useTranslations();
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{t('home.stories.title')}</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
          {storyIds.map(id => {
            const title = t(`home.stories.items.${id}.title`);
            return (
              <div key={id} className="flex-shrink-0 w-64 group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden shadow-lg h-80">
                  <img src={`https://picsum.photos/seed/story${id}/400/500`} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-sm opacity-80">{t(`home.stories.items.${id}.user`)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MainCarousel;
