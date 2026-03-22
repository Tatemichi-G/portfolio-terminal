import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GlobalNav from "./GlobalNav.jsx";

export default function Header({ pageType = "home" }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // ハンバーガーメニューを明示的に閉じる
  const closeMenu = () => {
    setIsOpen(false);
  };

  //ページ移動すればハンバーガーメニューを閉じる
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className={isOpen ? "menu-open" : ""}>
      <div className='container'>
        <h1 className='logo font-roboto'>
          <Link to='/' onClick={closeMenu}>
            G-tatemi
          </Link>
        </h1>
        <button
          type='button'
          className={isOpen ? "is-open menu-button" : "menu-button"}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={
            isOpen ? "メニューを閉じるボタン" : "メニューを開くボタン"
          }
        >
          <span></span>
          <span></span>
        </button>
      </div>
      {isOpen ? (
        <nav className='sp-nav font-roboto'>
          <div className='container'>
            <GlobalNav
              closeMenu={closeMenu}
              navClass='menu-nav-list'
              pageType={pageType}
            />
          </div>
        </nav>
      ) : (
        <></>
      )}
    </header>
  );
}
