import { useState } from "react";
import { workTags } from "./WorkersArray.jsx";
import { Link } from "react-router-dom";

export default function WorksDisplay({
  selectedTagId,
  setSelectedTagId,
  displayWorks,
  all,
  worksRef,
}) {
  // ホバーの状態管理。 ゴール=>ホバー時拡大 ＆ 背景に画像もしくは動画を描画
  const [hoveredWork, setHoveredWork] = useState(null);
  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches; //スマホの動きを排除

  return (
    <>
      <div className='container works-wrapper'>
        <h2 className='title font-gothic'>作品一覧</h2>

        <div className='tag-wrapper'>
          <button
            className={selectedTagId === all ? "is-active" : ""}
            onClick={() => setSelectedTagId(all)}
          >
            すべて
          </button>

          {workTags.map((wt) => (
            <button
              key={wt.id}
              className={selectedTagId === wt.id ? "is-active" : ""}
              onClick={() => {
                setSelectedTagId(wt.id);
              }}
            >
              {wt.tagName}
            </button>
          ))}
        </div>

        {hoveredWork && canHover && (
          <div className='work-hover-bg'>
            {hoveredWork?.video ? (
              <video
                className='work-hover-display'
                autoPlay
                muted
                playsInline
                loop
                src={hoveredWork.video}
              ></video>
            ) : (
              <img
                className='work-hover-display'
                src={hoveredWork.url}
                alt={hoveredWork.name}
              />
            )}
          </div>
        )}
        <ul className='works-list'>
          {/* indexも明示的に引き数を渡す。 */}

          {displayWorks.map((work, index) => {
            return (
              <li
                key={work.id}
                className='work-card'
                ref={(el) => (worksRef.current[index] = el)}
                onMouseEnter={() => {
                  if (!canHover) return;
                  setHoveredWork(work);
                }}
                onMouseLeave={() => {
                  if (!canHover) return;
                  setHoveredWork(null);
                }}
                style={{
                  border:
                    hoveredWork?.id === work.id
                      ? "6px solid orange"
                      : undefined,
                }}
              >
                <Link to={`/works/${work.id}`} className='card-link'>
                  <div>
                    <p className='work-name font-gothic'>{work.name}</p>
                    <h3 className='work-name font-mincho'>{work.nameJa}</h3>
                  </div>
                  <img src={work.url} alt={work.name} className='work-img' />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
