import React, { useState } from 'react';
import { NEWS_ARTICLE_IDS } from '../constants';
import { useTranslations } from '../hooks/useTranslations';

const categories = ['All', 'Technology', 'Event', 'Education', 'Government'];

const NewsFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useTranslations();

  // In a real app, filtering logic would be more complex
  const filteredArticles = NEWS_ARTICLE_IDS.map(id => {
      const category = t(`home.news.articles.${id}.category`);
      return {
          id,
          title: t(`home.news.articles.${id}.title`),
          summary: t(`home.news.articles.${id}.summary`),
          imageUrl: `https://picsum.photos/seed/news${id}/400/300`,
          category: category,
          date: t(`home.news.articles.${id}.date`),
          rawCategory: t(`home.news.categories.${category.toLowerCase()}`),
          url: t(`home.news.articles.${id}.url`),
      };
  }).filter(article => activeCategory === 'All' || article.rawCategory === activeCategory);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{t('home.news.title')}</h2>
      
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              activeCategory === category
                ? 'bg-halal-green text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t(`home.news.categories.${category.toLowerCase()}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArticles.map(article => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-md overflow-hidden group transition-shadow hover:shadow-xl block"
          >
            <div className="h-40 overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-halal-green uppercase">{article.category}</p>
              <h3 className="font-bold text-md mt-1 h-12">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-2 h-16 overflow-hidden">{article.summary}</p>
              <p className="text-xs text-gray-400 mt-4">{article.date}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bg-white text-halal-green font-bold py-2 px-6 rounded-full shadow hover:bg-gray-50 transition-colors">
          {t('home.news.loadMore')}
        </button>
      </div>
    </section>
  );
};

export default NewsFeed;