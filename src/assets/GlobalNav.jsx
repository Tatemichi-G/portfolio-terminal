import { useState } from "react";
import { Link } from "react-router-dom";
import { works, workTags } from "./WorkersArray.jsx";

const navArray = [
  {
    id: 1,
    name: "Top",
    target: "top",
  },
  {
    id: 2,
    name: "About",
    target: "about",
  },
  // レイアウト上worksを独立させる
  // {
  //   id: 3,
  //   name: "Works",
  //   target: "works",
  // },
  {
    id: 4,
    name: "News",
    target: "news",
  },
  {
    id: 5,
    name: "Contact",
    target: "contact",
  },
];

export default function GlobalNav({
  closeMenu = null,
  navClass = "",
  pageType = "home",
}) {
  const makeHref = (target) => {
    if (pageType === "home") {
      if (target === "top") {
        return "#top";
      }

      return `#${target}`;
    }

    if (target === "top") {
      return "/";
    }

    return `/#${target}`;
  };

  const handleClick = () => {
    if (closeMenu) {
      closeMenu();
    }
  };

  // worksのホバー処理を作る =>
  const [hoveredId, setHoveredId] = useState("all");
  const hoverWorks =
    hoveredId === "all"
      ? works.filter((work) => work.tagId)
      : works.filter((work) => work.tagId === hoveredId);

  return (
    <div className={`global-nav ${navClass}`.trim()}>
      <ul className='global-nav-list'>
        {navArray.map((nav) => {
          return (
            <li key={nav.id}>
              <a href={makeHref(nav.target)} onClick={handleClick}>
                {nav.name}
              </a>
            </li>
          );
        })}

        <li>
          <a
            href={makeHref("works")}
            className='nav-list-works'
            onClick={() => {
              handleClick();
              setHoveredId("all");
            }}
          >
            Works
          </a>
        </li>
      </ul>

      <div className='nav-works-wrapper'>
        <div className='nav-works'>
          <ul className='nav-works-btn-wrapper'>
            <li>
              <button
                type='button'
                onMouseEnter={() => setHoveredId("all")}
                onClick={() => setHoveredId("all")}
              >
                All
              </button>
            </li>
            {workTags.map((tag) => (
              <li key={tag.id}>
                <button
                  type='button'
                  onMouseEnter={() => setHoveredId(tag.id)}
                  onClick={() => setHoveredId(tag.id)}
                >
                  {tag.tagName}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className='hover-wrapper'>
          {hoverWorks.length ? (
            <>
              {hoverWorks.map((work) => (
                <Link
                  to={`/works/${work.id}`}
                  key={work.id}
                  className='nav-work-link'
                >
                  ＞ {work.name}
                </Link>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
