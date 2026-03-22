import GlobalNav from "./GlobalNav.jsx";

export default function Footer({ pageType = "home" }) {
  return (
    <footer>
      <div className='container footer-wrapper'>
        <a
          className='footer-logo font-roboto'
          href='https://github.com/Tatemichi-G/portfolio-terminal'
          target='_blank'
          rel='noreferrer'
        >
          Git Hubを見る
        </a>
        <nav className='footer-nav font-roboto'>
          <GlobalNav pageType={pageType} />
        </nav>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "white",
          marginTop: 24,
          padding: 4,
        }}
      >
        <small>&copy; Genki Tatemichi. All rights reserved 2026</small>
      </div>
    </footer>
  );
}
