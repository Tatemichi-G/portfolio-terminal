import { useState, useEffect } from "react";

export default function News({ cmsNews }) {
  const maxNewsIndex = Math.max(cmsNews.length - 1, 0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    setCurrentNewsIndex((prev) => Math.min(prev, maxNewsIndex));
  }, [maxNewsIndex]);

  const moveNews = (nextIndex) => {
    if (nextIndex < 0) {
      setCurrentNewsIndex(0);
      return;
    }

    if (nextIndex > maxNewsIndex) {
      setCurrentNewsIndex(maxNewsIndex);
      return;
    }

    setCurrentNewsIndex(nextIndex);
  };

  const isFirstNews = currentNewsIndex === 0;
  const isLastNews = currentNewsIndex === maxNewsIndex;

  return (
    <section id='news'>
      <div className='container'>
        <h2 className='title font-gothic'>最新情報</h2>
        <div className='news-view'>
          <ul
            className='news-list'
            style={{
              transform: `translateX(calc(-${currentNewsIndex} * (100% + var(--news-gap))))`,
            }}
          >
            {cmsNews.map((news) => {
              const dateText = news.createdAt
                ? news.createdAt.slice(0, 10)
                : "";
              const summaryText = news.summary ? news.summary : news.content;

              return (
                <li key={news.id} className='news'>
                  {news.image?.url ? (
                    <img src={news.image.url} alt={news.title} />
                  ) : null}

                  <div className='news-text'>
                    {news.category || dateText ? (
                      <p className='news-meta font-roboto'>
                        {news.category ? news.category : "News"}
                        {dateText ? ` / ${dateText}` : ""}
                      </p>
                    ) : null}
                    <h3>{news.title}</h3>
                    <p>{summaryText}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='news-controls'>
          <button
            type='button'
            className='first'
            onClick={() => moveNews(0)}
            disabled={isFirstNews}
          >
            <img src='/icons/chevron-double-left.svg' alt='最初に戻るボタン' />
          </button>
          <button
            type='button'
            className='prev'
            onClick={() => moveNews(currentNewsIndex - 1)}
            disabled={isFirstNews}
          >
            <img src='/icons/chevron-left.svg' alt='前に戻るボタン' />
          </button>
          <p className='news-count font-roboto'>
            {cmsNews.length === 0 ? 0 : currentNewsIndex + 1} / {cmsNews.length}
          </p>
          <button
            type='button'
            className='next'
            onClick={() => moveNews(currentNewsIndex + 1)}
            disabled={isLastNews}
          >
            <img src='/icons/chevron-right.svg' alt='次に進むボタン' />
          </button>
          <button
            type='button'
            className='last'
            onClick={() => moveNews(maxNewsIndex)}
            disabled={isLastNews}
          >
            <img src='/icons/chevron-double-right.svg' alt='最後を見るボタン' />
          </button>
        </div>
      </div>
    </section>
  );
}
